package com.pratham.learning;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * ZoomPackage - Registers the ZoomModule with React Native
 * 
 * This package class is required to expose the native Zoom module to JavaScript
 * It needs to be added to the packages list in MainApplication.kt
 */
public class ZoomPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        // Add ZoomModule to the list of native modules
        modules.add(new ZoomModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        // No custom view managers needed for Zoom integration
        return Collections.emptyList();
    }
}

