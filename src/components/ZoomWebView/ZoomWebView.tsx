import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { WebView } from "react-native-webview";

interface ZoomWebViewProps {
  uri: string;
  userName?: string;
}

/**
 * On Android 9 (API 28) Zoom's web-client blocks the session because it
 * detects an old Android / Chrome version from the User-Agent.
 * Spoofing to Android 10 + Chrome 114 passes that version gate so the
 * meeting loads exactly as it does on higher versions.
 */
const getSpoofedUserAgent = (): string | undefined => {
  if (Platform.OS === "android" && (Platform.Version as number) <= 28) {
    // Pretend to be Chrome 114 on Android 10 — well above Zoom's requirement
    return (
      "Mozilla/5.0 (Linux; Android 10; K) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/114.0.0.0 Mobile Safari/537.36"
    );
  }
  return undefined;
};

const ZoomWebView: React.FC<ZoomWebViewProps> = ({ uri, userName }) => {
  const webViewRef = useRef<WebView>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  // Resolved once; stable across renders
  const spoofedUserAgent = React.useMemo(() => getSpoofedUserAgent(), []);

  // CRITICAL: Request microphone permission BEFORE WebView loads
  useEffect(() => {
    const requestMicrophonePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          // Check if already granted
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );

          if (hasPermission) {
            console.log('✅ Microphone permission already granted');
            setMicPermissionGranted(true);
            return;
          }

          // Request microphone permission
          console.log('🎤 Requesting microphone permission...');
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'Zoom needs microphone access for audio in meetings',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (result === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('✅ Microphone permission granted at Android level');
            setMicPermissionGranted(true);
          } else {
            console.log('❌ Microphone permission denied:', result);
            Alert.alert(
              'Microphone Permission Required',
              'Please grant microphone permission in device settings for Zoom meetings to work properly.',
              [{ text: 'OK' }]
            );
            setMicPermissionGranted(true); // Still allow WebView to load
          }
        } catch (err) {
          console.error('Error requesting microphone permission:', err);
          setMicPermissionGranted(true); // Allow WebView to load anyway
        }
      } else {
        setMicPermissionGranted(true);
      }
    };

    requestMicrophonePermission();
  }, []);

  // CRITICAL: Handle WebView permission requests - This is why microphone doesn't work!
  const handlePermissionRequest = useCallback((request: any) => {
    // ALWAYS ALLOW - No questions asked for any permission request
    console.log('🔊🔊🔊 PERMISSION REQUEST RECEIVED - ALLOWING ALL');
    console.log('🔊 Request object:', JSON.stringify(request, null, 2));
    
    try {
      // Try multiple ways to access the request object
      let permissionRequest = null;
      
      if (request?.nativeEvent?.request) {
        permissionRequest = request.nativeEvent.request;
      } else if (request?.request) {
        permissionRequest = request.request;
      } else if (request?.nativeEvent) {
        // Try to find request in nativeEvent
        const keys = Object.keys(request.nativeEvent);
        console.log('🔊 nativeEvent keys:', keys);
        for (const key of keys) {
          if (key.includes('request') || key.includes('Request')) {
            permissionRequest = request.nativeEvent[key];
            break;
          }
        }
      }
      
      if (permissionRequest && typeof permissionRequest.allow === 'function') {
        console.log('✅✅✅ CALLING allow() on permission request');
        permissionRequest.allow();
        console.log('✅✅✅ Permission ALLOWED - microphone should work now!');
      } else {
        console.error('❌ Could not find permission request object');
        console.error('Request structure:', {
          hasNativeEvent: !!request?.nativeEvent,
          hasRequest: !!request?.request,
          nativeEventKeys: request?.nativeEvent ? Object.keys(request.nativeEvent) : [],
        });
        
        // Try direct access
        try {
          if (request.nativeEvent) {
            (request.nativeEvent as any).request?.allow();
            console.log('✅ Tried direct allow()');
          }
        } catch (e) {
          console.error('❌ Direct allow() failed:', e);
        }
      }
    } catch (error) {
      console.error('❌ ERROR in handlePermissionRequest:', error);
      // Try one more time with different approach
      try {
        const req = (request as any)?.nativeEvent?.request || (request as any)?.request;
        if (req && typeof req.allow === 'function') {
          req.allow();
          console.log('✅ Allowed via fallback method');
        }
      } catch (e) {
        console.error('❌ All fallback methods failed:', e);
      }
    }
  }, []);

  /* ------------------------------------------------ */
  /* BLOCK ZOOM APP REDIRECT                          */
  /* ------------------------------------------------ */

  const shouldBlockUrl = (url: string) => {
    const blocked = [
      "zoommtg://",
      "zoomus://",
      "intent://",
      "market://",
      "play.google.com",
      "itunes.apple.com",
      "zoom.us/client",
      "download.zoom.us",
    ];

    return blocked.some((pattern) =>
      url.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  const openExternalApp = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert("Zoom app not installed");
    }
  };

  /* ------------------------------------------------ */
  /* AUTO FILL SCRIPT                                 */
  /* ------------------------------------------------ */

  const injectedJS = useMemo(() => {
    const name = JSON.stringify(userName || "");
    // Pass the spoofed UA into the JS so navigator.userAgent matches the
    // HTTP header we already sent via the WebView userAgent prop.
    const spoofedUA = getSpoofedUserAgent();
    const spoofedUAJson = JSON.stringify(spoofedUA ?? null);

    return `
      (function(){

        const userName = ${name};

        // ============================================
        // ANDROID 9 FIX: Spoof navigator.userAgent so Zoom's JS-side
        // version check also sees Android 10 + Chrome 114.
        // ============================================
        (function spoofUserAgent() {
          const newUA = ${spoofedUAJson};
          if (!newUA) return; // not Android 9, nothing to do

          try {
            Object.defineProperty(navigator, 'userAgent', {
              get: function() { return newUA; },
              configurable: true,
            });
            console.log('✅ navigator.userAgent spoofed to:', newUA);
          } catch(e) {
            console.warn('⚠️ Could not spoof navigator.userAgent:', e);
          }

          // Also spoof appVersion which some older checks use
          try {
            Object.defineProperty(navigator, 'appVersion', {
              get: function() { return newUA.replace('Mozilla/', ''); },
              configurable: true,
            });
          } catch(e) {}
        })();

        // ============================================
        // CRITICAL FIX: Pre-request microphone BEFORE Zoom checks
        // ============================================
        
        // ============================================
        // CRITICAL: Override permission query API
        // ============================================
        // Zoom checks permissions using navigator.permissions.query
        // We need to override this to always return 'granted'
        if (navigator.permissions && navigator.permissions.query) {
          const originalQuery = navigator.permissions.query.bind(navigator.permissions);
          navigator.permissions.query = function(descriptor) {
            console.log('🔍 Permission query:', descriptor.name);
            
            // ALWAYS return granted for microphone/camera - this prevents "blocked" message
            if (descriptor.name === 'microphone' || 
                descriptor.name === 'camera' || 
                descriptor.name === 'audio-capture' ||
                descriptor.name === 'video-capture') {
              console.log('✅ Overriding permission query to return GRANTED for:', descriptor.name);
              return Promise.resolve({ 
                state: 'granted', 
                onchange: null,
                addEventListener: function() {},
                removeEventListener: function() {}
              });
            }
            
            return originalQuery(descriptor);
          };
        }
        
        // Also override permissions API if it exists differently
        if (navigator.permissions) {
          Object.defineProperty(navigator.permissions, 'query', {
            value: function(descriptor) {
              const name = descriptor.name || '';
              if (name.includes('microphone') || name.includes('audio') || name.includes('camera') || name.includes('video')) {
                console.log('✅ Permission query override - returning granted for:', name);
                return Promise.resolve({ state: 'granted', onchange: null });
              }
              return Promise.resolve({ state: 'prompt', onchange: null });
            },
            writable: true,
            configurable: true
          });
        }
        
        // Request microphone permission IMMEDIATELY on page load
        // This must happen BEFORE Zoom checks permissions
        (function preRequestMicrophone() {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log('🎤 Pre-requesting microphone access immediately...');
            
            // Request microphone access right away - CRITICAL for microphone to work
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
              .then(function(stream) {
                console.log('✅✅✅ Microphone pre-request SUCCESS - Permission granted!');
                console.log('🎤 Audio tracks:', stream.getAudioTracks().length);
                
                // Keep the stream active so permission stays granted
                // Don't stop it - Zoom needs it
                window._microphoneStream = stream;
                
                // Log track details
                stream.getAudioTracks().forEach(function(track) {
                  console.log('🎤 Audio track:', track.id, 'enabled:', track.enabled, 'readyState:', track.readyState);
                });
              })
              .catch(function(err) {
                console.error('❌ Microphone pre-request FAILED:', err.name, err.message);
                console.error('❌ Error details:', JSON.stringify(err));
                // Retry after a short delay - keep trying
                setTimeout(preRequestMicrophone, 1000);
              });
          } else {
            console.log('⚠️ mediaDevices not ready, retrying...');
            // Retry if mediaDevices not ready yet
            setTimeout(preRequestMicrophone, 500);
          }
        })();
        
        // Also request on DOMContentLoaded and window load
        document.addEventListener('DOMContentLoaded', function() {
          console.log('📄 DOMContentLoaded - requesting microphone...');
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(s => {
                console.log('✅ Microphone granted on DOMContentLoaded');
                window._micStreamDOM = s;
              })
              .catch(e => console.error('❌ Microphone failed on DOMContentLoaded:', e));
          }
        });
        
        window.addEventListener('load', function() {
          console.log('📄 Window loaded - requesting microphone...');
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(s => {
                console.log('✅ Microphone granted on window load');
                window._micStreamWindow = s;
              })
              .catch(e => console.error('❌ Microphone failed on window load:', e));
          }
        });
        
        // Override getUserMedia to ensure microphone works - CRITICAL FIX
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
          
          navigator.mediaDevices.getUserMedia = function(constraints) {
            console.log('🎤🎤🎤 getUserMedia called:', JSON.stringify(constraints));
            
            // If audio is requested, ensure it's explicitly allowed
            if (constraints.audio) {
              console.log('🔊🔊🔊 AUDIO REQUESTED - This is the microphone call!');
            }
            
            return originalGetUserMedia(constraints)
              .then(function(stream) {
                const tracks = stream.getTracks();
                console.log('✅✅✅ getUserMedia SUCCESS - Tracks:', tracks.map(t => t.kind));
                
                // Log microphone track specifically
                const audioTracks = tracks.filter(t => t.kind === 'audio');
                if (audioTracks.length > 0) {
                  console.log('🎤🎤🎤 Microphone track active:', audioTracks[0].id);
                  console.log('🎤 Track enabled:', audioTracks[0].enabled);
                  console.log('🎤 Track readyState:', audioTracks[0].readyState);
                } else {
                  console.warn('⚠️⚠️⚠️ NO AUDIO TRACKS IN STREAM!');
                }
                
                return stream;
              })
              .catch(function(err) {
                console.error('❌❌❌ getUserMedia FAILED:', err.name, err.message);
                console.error('❌ Error code:', err.code);
                console.error('❌ Full error:', JSON.stringify(err));
                
                // If it's a permission error, retry multiple times
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.name === 'NotReadableError') {
                  console.log('🔄 Permission error detected - retrying in 500ms...');
                  
                  // Retry with delay
                  return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                      console.log('🔄 Retrying getUserMedia...');
                      originalGetUserMedia(constraints)
                        .then(resolve)
                        .catch(function(retryErr) {
                          console.error('❌ Retry also failed:', retryErr.name);
                          // Try one more time
                          setTimeout(function() {
                            originalGetUserMedia(constraints)
                              .then(resolve)
                              .catch(reject);
                          }, 1000);
                        });
                    }, 500);
                  });
                }
                
                throw err;
              });
          };
        } else {
          console.error('❌❌❌ navigator.mediaDevices.getUserMedia NOT AVAILABLE!');
        }
        
        // Monitor microphone button clicks in Zoom
        document.addEventListener('click', function(e) {
          const target = e.target;
          if (target && (
            target.classList.contains('zm-btn') ||
            target.closest('.zm-btn') ||
            target.getAttribute('aria-label')?.toLowerCase().includes('microphone') ||
            target.getAttribute('aria-label')?.toLowerCase().includes('mute')
          )) {
            console.log('🎤 Microphone button clicked, requesting access...');
            
            // Immediately request microphone access when button is clicked
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                  console.log('✅ Microphone access granted after button click');
                  stream.getTracks().forEach(track => {
                    if (track.kind === 'audio') {
                      console.log('🎤 Audio track ready:', track.id);
                    }
                  });
                })
                .catch(function(err) {
                  console.error('❌ Microphone access failed after button click:', err);
                });
            }
          }
        }, true);
        
        // ============================================
        // HIDE "JOIN FROM APP" & AUTO-CLICK "JOIN FROM BROWSER"
        // ============================================
        (function handleZoomLaunchPage() {

          // Phrases whose buttons/links must be HIDDEN
          var HIDE_PHRASES = [
            'join from app',
            'open zoom',
            'open in app',
            'launch zoom',
            'launch app',
            'download zoom',
            'google play',
            'join from your computer',
          ];

          // Phrases whose buttons must be AUTO-CLICKED (browser join)
          var CLICK_PHRASES = [
            'join from browser',
            'join from your browser',
            'join from the browser',
            'join in browser',
          ];

          // CSS selectors known to wrap the "open in app" elements
          var HIDE_SELECTORS = [
            '.launch-app-btn',
            '#btn-join-app',
            '.app-banner',
            '.open-app-banner',
            '.zm-btn-legacy.open-in-desktop',
            '[class*="open-in-app"]',
            '[class*="openInApp"]',
            '[class*="launch-app"]',
            '[id*="open-in-app"]',
            '[id*="launch-app"]',
            '.meeting-app-download-section',
            '.app-download-btn',
            '.footer-download-app',
            '.download-app-section',
            // "Or" divider + download row shown in screenshot
            '.download-app-row',
            '[class*="download-app"]',
          ];

          var browserBtnClicked = false;

          function processPage() {
            // --- 1. Hide by CSS selector ---
            HIDE_SELECTORS.forEach(function(sel) {
              try {
                document.querySelectorAll(sel).forEach(function(el) {
                  el.style.setProperty('display', 'none', 'important');
                });
              } catch(e) {}
            });

            // --- 2. Walk every visible <a> and <button> ---
            document.querySelectorAll('a, button').forEach(function(el) {
              var text = (el.textContent || '').toLowerCase().trim();

              // Auto-click "Join from browser" ONCE
              if (!browserBtnClicked) {
                var shouldClick = CLICK_PHRASES.some(function(phrase) {
                  return text === phrase || text.includes(phrase);
                });
                if (shouldClick) {
                  browserBtnClicked = true;
                  console.log('✅ Auto-clicking "Join from browser":', el.textContent.trim());
                  el.click();
                  return; // don't hide this button
                }
              }

              // Hide "Join from App" and download-related buttons
              var shouldHide = HIDE_PHRASES.some(function(phrase) {
                return text.includes(phrase);
              });
              if (shouldHide) {
                el.style.setProperty('display', 'none', 'important');
                // Hide parent wrapper if it only contains this element
                var parent = el.parentElement;
                if (parent && parent.children.length === 1) {
                  parent.style.setProperty('display', 'none', 'important');
                }
              }
            });

            // --- 3. Hide "Or" separator + download row (siblings of hidden elements) ---
            // Look for any element whose text is just "or" / "Or"
            document.querySelectorAll('div, span, p, hr').forEach(function(el) {
              var text = (el.textContent || '').trim().toLowerCase();
              if (text === 'or') {
                el.style.setProperty('display', 'none', 'important');
              }
            });
          }

          // Run immediately
          processPage();

          // Run on DOM events
          document.addEventListener('DOMContentLoaded', processPage);
          window.addEventListener('load', processPage);

          // Watch for Zoom's async UI injection
          var obs = new MutationObserver(function() { processPage(); });
          obs.observe(document.documentElement, { childList: true, subtree: true });

          // Sweep every 300 ms for the first 15 seconds
          var count = 0;
          var timer = setInterval(function() {
            processPage();
            if (++count >= 50) clearInterval(timer);
          }, 300);

        })();

        let isUserInteracting = false;
        let filledInputs = new Set();
        let interactionTimeout = null;

        // Track user interactions
        document.addEventListener('focus', function(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            isUserInteracting = true;
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
              isUserInteracting = false;
            }, 2000);
          }
        }, true);

        document.addEventListener('input', function(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            isUserInteracting = true;
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
              isUserInteracting = false;
            }, 2000);
          }
        }, true);

        function setReactInputValue(input, value){

          const nativeSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          ).set;

          nativeSetter.call(input, value);

          // Dispatch events in the correct order for React
          const inputEvent = new Event("input", { bubbles: true, cancelable: true });
          const changeEvent = new Event("change", { bubbles: true, cancelable: true });
          
          input.dispatchEvent(inputEvent);
          input.dispatchEvent(changeEvent);
          
          // Also trigger React's synthetic events
          const reactInputEvent = new Event("input", { bubbles: true, cancelable: true });
          Object.defineProperty(reactInputEvent, 'target', { value: input, enumerable: true });
          input.dispatchEvent(reactInputEvent);

          // Trigger focus/blur cycle to ensure React state updates
          const wasFocused = document.activeElement === input;
          if (!wasFocused) {
            input.focus();
          }
          
          // Small delay to ensure React processes the change
          setTimeout(() => {
            if (!wasFocused) {
              input.blur();
            }
          }, 100);

        }

        function autoFillName(){

          if(!userName || isUserInteracting) return;

          const inputs = document.querySelectorAll("input");

          inputs.forEach(input=>{

            const placeholder = (input.placeholder || "").toLowerCase();
            const id = (input.id || "").toLowerCase();
            const nameAttr = (input.name || "").toLowerCase();
            const type = (input.type || "").toLowerCase();

            // Skip if it's not a text input or if it's already filled correctly
            if (type === 'checkbox' || type === 'radio' || type === 'button' || type === 'submit') {
              return;
            }

            if(
              (placeholder.includes("name") ||
              id.includes("name") ||
              nameAttr.includes("name")) &&
              input.value !== userName
            ){

              // Mark this input as filled to avoid re-filling
              filledInputs.add(input);

              setReactInputValue(input, userName);

              console.log("Zoom username autofilled:", userName);

            }

          });

        }

        // Initial fill with delay to ensure DOM is ready
        setTimeout(() => {
          autoFillName();
        }, 500);

        // Less aggressive observer - only watch for new input elements
        const observer = new MutationObserver((mutations) => {
          // Only trigger if new input elements are added and user is not interacting
          if (isUserInteracting) return;
          
          let hasNewInputs = false;
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Element node
                if (node.tagName === 'INPUT' || node.querySelectorAll('input').length > 0) {
                  hasNewInputs = true;
                }
              }
            });
          });

          if (hasNewInputs) {
            // Debounce to avoid multiple rapid calls
            clearTimeout(window.autoFillTimeout);
            window.autoFillTimeout = setTimeout(() => {
              autoFillName();
            }, 300);
          }
        });

        observer.observe(document.body,{
          childList:true,
          subtree:true
        });

        window.zoomAutoFillName = autoFillName;

        true;

      })();
    `;
  }, [userName]);

  /* ------------------------------------------------ */
  /* NAVIGATION CONTROL                               */
  /* ------------------------------------------------ */

  const onShouldStartLoadWithRequest = useCallback((request: any) => {
    const { url } = request;

    if (shouldBlockUrl(url)) {
      Alert.alert(
        "Open Zoom App?",
        "This link wants to open the Zoom mobile app.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open", onPress: () => openExternalApp(url) },
        ]
      );

      return false;
    }

    return true;
  }, []);

  /* ------------------------------------------------ */
  /* LOAD EVENTS                                      */
  /* ------------------------------------------------ */

  const onLoadStart = () => {
    setLoading(true);
  };

  const onLoadEnd = () => {
    setLoading(false);

    // Inject JavaScript to request microphone immediately after page loads
    webViewRef.current?.injectJavaScript(`
      (function() {
        console.log('📄 onLoadEnd - Page fully loaded');
        
        // Request microphone access immediately after page load
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log('🎤 Requesting microphone after page load...');
          
          // Try multiple times with delays
          [0, 500, 1000, 2000].forEach(function(delay) {
            setTimeout(function() {
              navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                  console.log('✅✅✅ Microphone access granted after page load (delay: ' + delay + 'ms)!');
                  console.log('🎤 Audio tracks:', stream.getAudioTracks().length);
                  window._micStream = stream;
                  
                  // Keep stream alive
                  stream.getAudioTracks().forEach(function(track) {
                    track.enabled = true;
                    console.log('🎤 Track enabled:', track.id);
                  });
                })
                .catch(function(err) {
                  console.error('❌ Microphone access failed after page load (delay: ' + delay + 'ms):', err.name, err.message);
                  if (err.name === 'NotAllowedError') {
                    console.error('❌❌❌ PERMISSION DENIED - onPermissionRequest handler may not be working!');
                  }
                });
            }, delay);
          });
        } else {
          console.error('❌ navigator.mediaDevices.getUserMedia not available!');
        }
        
        // Check permission status
        if (navigator.permissions && navigator.permissions.query) {
          navigator.permissions.query({ name: 'microphone' })
            .then(function(result) {
              console.log('🔍 Microphone permission status:', result.state);
            })
            .catch(function(err) {
              console.error('❌ Permission query failed:', err);
            });
        }
        
        if(window.zoomAutoFillName){
          window.zoomAutoFillName();
        }
      })();
      true;
    `);
  };

  const onError = () => {
    setError("Failed to load Zoom meeting.");
    setLoading(false);
  };

  /* ------------------------------------------------ */
  /* ERROR SCREEN                                     */
  /* ------------------------------------------------ */

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => webViewRef.current?.reload()}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ------------------------------------------------ */
  /* MAIN UI                                          */
  /* ------------------------------------------------ */

  return (
    <View style={styles.container}>
      {!micPermissionGranted && Platform.OS === 'android' ? (
        <View style={styles.permissionPrompt}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.permissionText}>Requesting microphone permission...</Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // CRITICAL: These props enable media access
          originWhitelist={['*']}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          injectedJavaScript={injectedJS}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
          onError={onError}
          // Spoof User-Agent on Android 9 so Zoom's version gate is bypassed
          {...(spoofedUserAgent ? { userAgent: spoofedUserAgent } : {})}
          // CRITICAL: This handler grants microphone permission - THIS IS THE KEY!
          {...(Platform.OS === 'android' ? {
            onPermissionRequest: (request: any) => {
              console.log('🔊🔊🔊 onPermissionRequest CALLED!');
              console.log('🔊 Request type:', typeof request);
              console.log('🔊 Request keys:', Object.keys(request || {}));
              handlePermissionRequest(request);
            },
            mixedContentMode: 'always' as any,
          } : {})}
        />
      )}

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading Zoom...</Text>
        </View>
      )}
    </View>
  );
};

/* ------------------------------------------------ */
/* STYLES                                           */
/* ------------------------------------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loader: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  permissionPrompt: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  permissionText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});

export default ZoomWebView;