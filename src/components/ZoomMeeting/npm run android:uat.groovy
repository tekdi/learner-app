npm run android:uat

> learnerapp@0.0.1 android:uat
> ENVFILE=.env.uat && cd android && ./gradlew assembleUatDebug && ./gradlew installUatDebug -PreactNativeDevServerPort=8081 && npm run android:launch

Starting a Gradle Daemon, 3 busy and 1 incompatible and 1 stopped Daemons could not be reused, use --status for details
Path for java installation '/usr/lib/jvm/openjdk-17' (Common Linux Locations) does not contain a java executable

> Configure project :app
Reading env from: .env.uat
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.

> Configure project :react-native-firebase_analytics
:react-native-firebase_analytics package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/analytics/package.json
:react-native-firebase_app package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/app/package.json
:react-native-firebase_analytics:firebase.bom using default value: 33.12.0
:react-native-firebase_analytics package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/analytics/package.json
:react-native-firebase_analytics:version set from package.json: 21.14.0 (21,14,0 - 21014000)
:react-native-firebase_analytics:android.compileSdk using custom value: 35
:react-native-firebase_analytics:android.targetSdk using custom value: 35
:react-native-firebase_analytics:android.minSdk using custom value: 28
:react-native-firebase_analytics:reactNativeAndroidDir /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native/android

> Configure project :react-native-firebase_app
:react-native-firebase_app package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/app/package.json
:react-native-firebase_app:firebase.bom using default value: 33.12.0
:react-native-firebase_app:play.play-services-auth using default value: 21.3.0
:react-native-firebase_app package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/app/package.json
:react-native-firebase_app:version set from package.json: 21.14.0 (21,14,0 - 21014000)
:react-native-firebase_app:android.compileSdk using custom value: 35
:react-native-firebase_app:android.targetSdk using custom value: 35
:react-native-firebase_app:android.minSdk using custom value: 28
:react-native-firebase_app:reactNativeAndroidDir /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native/android

> Configure project :react-native-firebase_messaging
:react-native-firebase_messaging package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/messaging/package.json
:react-native-firebase_app package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/app/package.json
:react-native-firebase_messaging:firebase.bom using default value: 33.12.0
:react-native-firebase_messaging package.json found at /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/@react-native-firebase/messaging/package.json
:react-native-firebase_messaging:version set from package.json: 21.14.0 (21,14,0 - 21014000)
:react-native-firebase_messaging:android.compileSdk using custom value: 35
:react-native-firebase_messaging:android.targetSdk using custom value: 35
:react-native-firebase_messaging:android.minSdk using custom value: 28
:react-native-firebase_messaging:reactNativeAndroidDir /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native/android

> Configure project :react-native-reanimated
Android gradle plugin: 8.6.0
Gradle: 8.7
Path for java installation '/usr/lib/jvm/openjdk-17' (Common Linux Locations) does not contain a java executable

> Task :react-native-push-notification:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.
Note: /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-push-notification/android/src/main/java/com/dieam/reactnativepushnotification/modules/RNPushNotification.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.

> Task :react-native-permissions:compileDebugKotlin
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/src/main/java/com/zoontek/rnpermissions/RNPermissionsPackage.kt:22:24 'constructor ReactModuleInfo(String!, String!, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/src/oldarch/com/zoontek/rnpermissions/RNPermissionsModule.kt:60:28 Parameter 'options' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/src/oldarch/com/zoontek/rnpermissions/RNPermissionsModule.kt:80:31 Parameter 'purposeKey' is never used
e: Daemon compilation failed: null
java.lang.Exception
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:69)
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:65)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemon(GradleKotlinCompilerWork.kt:244)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemonOrFallbackImpl(GradleKotlinCompilerWork.kt:175)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.run(GradleKotlinCompilerWork.kt:135)
        at org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction.execute(GradleCompilerRunnerWithWorkers.kt:73)
        at org.gradle.workers.internal.DefaultWorkerServer.execute(DefaultWorkerServer.java:63)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:66)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:62)
        at org.gradle.internal.classloader.ClassLoaderUtils.executeInClassloader(ClassLoaderUtils.java:100)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.lambda$execute$0(NoIsolationWorkerFactory.java:62)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:44)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:41)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:157)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:73)
        at org.gradle.workers.internal.AbstractWorker.executeWrappedInBuildOperation(AbstractWorker.java:41)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.execute(NoIsolationWorkerFactory.java:59)
        at org.gradle.workers.internal.DefaultWorkerExecutor.lambda$submitWork$0(DefaultWorkerExecutor.java:174)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runExecution(DefaultConditionalExecutionQueue.java:187)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.access$700(DefaultConditionalExecutionQueue.java:120)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner$1.run(DefaultConditionalExecutionQueue.java:162)
        at org.gradle.internal.Factories$1.create(Factories.java:31)
        at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:264)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:128)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:133)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runBatch(DefaultConditionalExecutionQueue.java:157)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.run(DefaultConditionalExecutionQueue.java:126)
        at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
        at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:47)
        at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
        at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
        at java.base/java.lang.Thread.run(Thread.java:840)
Caused by: org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase$CorruptedException: PersistentEnumerator storage corrupted /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm/lookups/lookups.tab
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase.<init>(PersistentEnumeratorBase.java:178)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentBTreeEnumerator.<init>(PersistentBTreeEnumerator.java:93)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumerator.createDefaultEnumerator(PersistentEnumerator.java:66)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapImpl.<init>(PersistentMapImpl.java:136)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.buildImplementation(PersistentMapBuilder.java:62)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.build(PersistentMapBuilder.java:44)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:39)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:54)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.createMap(CachingLazyStorage.kt:128)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.getStorageOrCreateNew(CachingLazyStorage.kt:57)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.append(CachingLazyStorage.kt:91)
        at org.jetbrains.kotlin.incremental.storage.LookupMap.append(LookupMap.kt:42)
        at org.jetbrains.kotlin.incremental.TrackedLookupMap.append(LookupStorage.kt:317)
        at org.jetbrains.kotlin.incremental.LookupStorage.addAll(LookupStorage.kt:124)
        at org.jetbrains.kotlin.incremental.BuildUtilKt.update(buildUtil.kt:134)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.doCompile(IncrementalCompilerRunner.kt:516)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileImpl(IncrementalCompilerRunner.kt:400)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileNonIncrementally(IncrementalCompilerRunner.kt:281)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compile(IncrementalCompilerRunner.kt:125)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.execIncrementalCompiler(CompileServiceImpl.kt:657)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.access$execIncrementalCompiler(CompileServiceImpl.kt:105)
        at org.jetbrains.kotlin.daemon.CompileServiceImpl.compile(CompileServiceImpl.kt:1624)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:569)
        at java.rmi/sun.rmi.server.UnicastServerRef.dispatch(UnicastServerRef.java:360)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:200)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:197)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:712)
        at java.rmi/sun.rmi.transport.Transport.serviceCall(Transport.java:196)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport.handleMessages(TCPTransport.java:587)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run0(TCPTransport.java:828)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.lambda$run$0(TCPTransport.java:705)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:399)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run(TCPTransport.java:704)
        ... 3 more

Failed to compile with Kotlin daemon: java.lang.Exception
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:69)
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:65)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemon(GradleKotlinCompilerWork.kt:244)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemonOrFallbackImpl(GradleKotlinCompilerWork.kt:175)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.run(GradleKotlinCompilerWork.kt:135)
        at org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction.execute(GradleCompilerRunnerWithWorkers.kt:73)
        at org.gradle.workers.internal.DefaultWorkerServer.execute(DefaultWorkerServer.java:63)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:66)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:62)
        at org.gradle.internal.classloader.ClassLoaderUtils.executeInClassloader(ClassLoaderUtils.java:100)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.lambda$execute$0(NoIsolationWorkerFactory.java:62)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:44)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:41)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:157)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:73)
        at org.gradle.workers.internal.AbstractWorker.executeWrappedInBuildOperation(AbstractWorker.java:41)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.execute(NoIsolationWorkerFactory.java:59)
        at org.gradle.workers.internal.DefaultWorkerExecutor.lambda$submitWork$0(DefaultWorkerExecutor.java:174)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runExecution(DefaultConditionalExecutionQueue.java:187)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.access$700(DefaultConditionalExecutionQueue.java:120)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner$1.run(DefaultConditionalExecutionQueue.java:162)
        at org.gradle.internal.Factories$1.create(Factories.java:31)
        at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:264)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:128)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:133)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runBatch(DefaultConditionalExecutionQueue.java:157)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.run(DefaultConditionalExecutionQueue.java:126)
        at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
        at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:47)
        at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
        at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
        at java.base/java.lang.Thread.run(Thread.java:840)
Caused by: org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase$CorruptedException: PersistentEnumerator storage corrupted /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm/lookups/lookups.tab
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase.<init>(PersistentEnumeratorBase.java:178)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentBTreeEnumerator.<init>(PersistentBTreeEnumerator.java:93)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumerator.createDefaultEnumerator(PersistentEnumerator.java:66)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapImpl.<init>(PersistentMapImpl.java:136)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.buildImplementation(PersistentMapBuilder.java:62)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.build(PersistentMapBuilder.java:44)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:39)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:54)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.createMap(CachingLazyStorage.kt:128)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.getStorageOrCreateNew(CachingLazyStorage.kt:57)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.append(CachingLazyStorage.kt:91)
        at org.jetbrains.kotlin.incremental.storage.LookupMap.append(LookupMap.kt:42)
        at org.jetbrains.kotlin.incremental.TrackedLookupMap.append(LookupStorage.kt:317)
        at org.jetbrains.kotlin.incremental.LookupStorage.addAll(LookupStorage.kt:124)
        at org.jetbrains.kotlin.incremental.BuildUtilKt.update(buildUtil.kt:134)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.doCompile(IncrementalCompilerRunner.kt:516)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileImpl(IncrementalCompilerRunner.kt:400)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileNonIncrementally(IncrementalCompilerRunner.kt:281)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compile(IncrementalCompilerRunner.kt:125)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.execIncrementalCompiler(CompileServiceImpl.kt:657)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.access$execIncrementalCompiler(CompileServiceImpl.kt:105)
        at org.jetbrains.kotlin.daemon.CompileServiceImpl.compile(CompileServiceImpl.kt:1624)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:569)
        at java.rmi/sun.rmi.server.UnicastServerRef.dispatch(UnicastServerRef.java:360)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:200)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:197)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:712)
        at java.rmi/sun.rmi.transport.Transport.serviceCall(Transport.java:196)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport.handleMessages(TCPTransport.java:587)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run0(TCPTransport.java:828)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.lambda$run$0(TCPTransport.java:705)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:399)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run(TCPTransport.java:704)
        ... 3 more
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.

> Task :react-native-permissions:compileDebugKotlin FAILED

> Task :react-native-vector-icons:compileDebugJavaWithJavac
Note: Some input files use or override a deprecated API.
Note: Recompile with -Xlint:deprecation for details.

> Task :react-native-safe-area-context:compileDebugKotlin
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaContextPackage.kt:27:11 'constructor ReactModuleInfo(String!, String!, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaContextPackage.kt:33:27 'hasConstants: Boolean' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-safe-area-context/android/src/main/java/com/th3rdwave/safeareacontext/SafeAreaView.kt:59:23 'getter for uiImplementation: UIImplementation!' is deprecated. Deprecated in Java

> Task :react-native-screens:compileDebugKotlin
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt:60:17 'constructor ReactModuleInfo(String!, String!, Boolean, Boolean, Boolean, Boolean, Boolean)' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:33:53 'FrameCallback' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenContainer.kt:34:38 'FrameCallback' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenStackHeaderConfig.kt:101:38 'getter for systemWindowInsetTop: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:62:53 'getter for statusBarColor: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:73:48 'getter for statusBarColor: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:76:32 'setter for statusBarColor: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:146:47 'replaceSystemWindowInsets(Int, Int, Int, Int): WindowInsetsCompat' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:147:51 'getter for systemWindowInsetLeft: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:149:51 'getter for systemWindowInsetRight: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:150:51 'getter for systemWindowInsetBottom: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:197:72 'getter for navigationBarColor: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/ScreenWindowTraits.kt:203:16 'setter for navigationBarColor: Int' is deprecated. Deprecated in Java
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarManager.kt:138:66 Elvis operator (?:) always returns the left operand of non-nullable type Boolean
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/SearchBarView.kt:153:43 Parameter 'flag' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:10:25 Parameter 'wrapper' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:13:9 Parameter 'width' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:14:9 Parameter 'height' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/FabricEnabledViewGroup.kt:15:9 Parameter 'headerHeight' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:7:36 Parameter 'fabricUIManager' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:11:13 Parameter 'tag' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:12:13 Parameter 'view' is never used
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/src/paper/java/com/swmansion/rnscreens/NativeProxy.kt:15:33 Parameter 'tag' is never used
e: Daemon compilation failed: null
java.lang.Exception
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:69)
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:65)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemon(GradleKotlinCompilerWork.kt:244)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemonOrFallbackImpl(GradleKotlinCompilerWork.kt:175)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.run(GradleKotlinCompilerWork.kt:135)
        at org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction.execute(GradleCompilerRunnerWithWorkers.kt:73)
        at org.gradle.workers.internal.DefaultWorkerServer.execute(DefaultWorkerServer.java:63)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:66)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:62)
        at org.gradle.internal.classloader.ClassLoaderUtils.executeInClassloader(ClassLoaderUtils.java:100)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.lambda$execute$0(NoIsolationWorkerFactory.java:62)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:44)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:41)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:157)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:73)
        at org.gradle.workers.internal.AbstractWorker.executeWrappedInBuildOperation(AbstractWorker.java:41)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.execute(NoIsolationWorkerFactory.java:59)
        at org.gradle.workers.internal.DefaultWorkerExecutor.lambda$submitWork$0(DefaultWorkerExecutor.java:174)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runExecution(DefaultConditionalExecutionQueue.java:187)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.access$700(DefaultConditionalExecutionQueue.java:120)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner$1.run(DefaultConditionalExecutionQueue.java:162)
        at org.gradle.internal.Factories$1.create(Factories.java:31)
        at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:264)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:128)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:133)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runBatch(DefaultConditionalExecutionQueue.java:157)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.run(DefaultConditionalExecutionQueue.java:126)
        at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
        at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:47)
        at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
        at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
        at java.base/java.lang.Thread.run(Thread.java:840)
Caused by: org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase$CorruptedException: PersistentEnumerator storage corrupted /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm/lookups/lookups.tab
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase.<init>(PersistentEnumeratorBase.java:178)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentBTreeEnumerator.<init>(PersistentBTreeEnumerator.java:93)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumerator.createDefaultEnumerator(PersistentEnumerator.java:66)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapImpl.<init>(PersistentMapImpl.java:136)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.buildImplementation(PersistentMapBuilder.java:62)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.build(PersistentMapBuilder.java:44)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:39)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:54)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.createMap(CachingLazyStorage.kt:128)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.getStorageOrCreateNew(CachingLazyStorage.kt:57)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.append(CachingLazyStorage.kt:91)
        at org.jetbrains.kotlin.incremental.storage.LookupMap.append(LookupMap.kt:42)
        at org.jetbrains.kotlin.incremental.TrackedLookupMap.append(LookupStorage.kt:317)
        at org.jetbrains.kotlin.incremental.LookupStorage.addAll(LookupStorage.kt:124)
        at org.jetbrains.kotlin.incremental.BuildUtilKt.update(buildUtil.kt:134)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.doCompile(IncrementalCompilerRunner.kt:516)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileImpl(IncrementalCompilerRunner.kt:400)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileNonIncrementally(IncrementalCompilerRunner.kt:281)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compile(IncrementalCompilerRunner.kt:125)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.execIncrementalCompiler(CompileServiceImpl.kt:657)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.access$execIncrementalCompiler(CompileServiceImpl.kt:105)
        at org.jetbrains.kotlin.daemon.CompileServiceImpl.compile(CompileServiceImpl.kt:1624)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:569)
        at java.rmi/sun.rmi.server.UnicastServerRef.dispatch(UnicastServerRef.java:360)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:200)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:197)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:712)
        at java.rmi/sun.rmi.transport.Transport.serviceCall(Transport.java:196)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport.handleMessages(TCPTransport.java:587)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run0(TCPTransport.java:828)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.lambda$run$0(TCPTransport.java:705)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:399)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run(TCPTransport.java:704)
        ... 3 more

Failed to compile with Kotlin daemon: java.lang.Exception
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:69)
        at org.jetbrains.kotlin.daemon.common.CompileService$CallResult$Error.get(CompileService.kt:65)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemon(GradleKotlinCompilerWork.kt:244)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.compileWithDaemonOrFallbackImpl(GradleKotlinCompilerWork.kt:175)
        at org.jetbrains.kotlin.compilerRunner.GradleKotlinCompilerWork.run(GradleKotlinCompilerWork.kt:135)
        at org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction.execute(GradleCompilerRunnerWithWorkers.kt:73)
        at org.gradle.workers.internal.DefaultWorkerServer.execute(DefaultWorkerServer.java:63)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:66)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1$1.create(NoIsolationWorkerFactory.java:62)
        at org.gradle.internal.classloader.ClassLoaderUtils.executeInClassloader(ClassLoaderUtils.java:100)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.lambda$execute$0(NoIsolationWorkerFactory.java:62)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:44)
        at org.gradle.workers.internal.AbstractWorker$1.call(AbstractWorker.java:41)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:200)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:195)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
        at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:157)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
        at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
        at org.gradle.internal.operations.DefaultBuildOperationExecutor.call(DefaultBuildOperationExecutor.java:73)
        at org.gradle.workers.internal.AbstractWorker.executeWrappedInBuildOperation(AbstractWorker.java:41)
        at org.gradle.workers.internal.NoIsolationWorkerFactory$1.execute(NoIsolationWorkerFactory.java:59)
        at org.gradle.workers.internal.DefaultWorkerExecutor.lambda$submitWork$0(DefaultWorkerExecutor.java:174)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runExecution(DefaultConditionalExecutionQueue.java:187)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.access$700(DefaultConditionalExecutionQueue.java:120)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner$1.run(DefaultConditionalExecutionQueue.java:162)
        at org.gradle.internal.Factories$1.create(Factories.java:31)
        at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:264)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:128)
        at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:133)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.runBatch(DefaultConditionalExecutionQueue.java:157)
        at org.gradle.internal.work.DefaultConditionalExecutionQueue$ExecutionRunner.run(DefaultConditionalExecutionQueue.java:126)
        at java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:539)
        at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
        at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
        at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:47)
        at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
        at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
        at java.base/java.lang.Thread.run(Thread.java:840)
Caused by: org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase$CorruptedException: PersistentEnumerator storage corrupted /home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm/lookups/lookups.tab
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumeratorBase.<init>(PersistentEnumeratorBase.java:178)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentBTreeEnumerator.<init>(PersistentBTreeEnumerator.java:93)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentEnumerator.createDefaultEnumerator(PersistentEnumerator.java:66)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapImpl.<init>(PersistentMapImpl.java:136)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.buildImplementation(PersistentMapBuilder.java:62)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentMapBuilder.build(PersistentMapBuilder.java:44)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:39)
        at org.jetbrains.kotlin.com.intellij.util.io.PersistentHashMap.<init>(PersistentHashMap.java:54)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.createMap(CachingLazyStorage.kt:128)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.getStorageOrCreateNew(CachingLazyStorage.kt:57)
        at org.jetbrains.kotlin.incremental.storage.CachingLazyStorage.append(CachingLazyStorage.kt:91)
        at org.jetbrains.kotlin.incremental.storage.LookupMap.append(LookupMap.kt:42)
        at org.jetbrains.kotlin.incremental.TrackedLookupMap.append(LookupStorage.kt:317)
        at org.jetbrains.kotlin.incremental.LookupStorage.addAll(LookupStorage.kt:124)
        at org.jetbrains.kotlin.incremental.BuildUtilKt.update(buildUtil.kt:134)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.doCompile(IncrementalCompilerRunner.kt:516)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileImpl(IncrementalCompilerRunner.kt:400)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compileNonIncrementally(IncrementalCompilerRunner.kt:281)
        at org.jetbrains.kotlin.incremental.IncrementalCompilerRunner.compile(IncrementalCompilerRunner.kt:125)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.execIncrementalCompiler(CompileServiceImpl.kt:657)
        at org.jetbrains.kotlin.daemon.CompileServiceImplBase.access$execIncrementalCompiler(CompileServiceImpl.kt:105)
        at org.jetbrains.kotlin.daemon.CompileServiceImpl.compile(CompileServiceImpl.kt:1624)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:569)
        at java.rmi/sun.rmi.server.UnicastServerRef.dispatch(UnicastServerRef.java:360)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:200)
        at java.rmi/sun.rmi.transport.Transport$1.run(Transport.java:197)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:712)
        at java.rmi/sun.rmi.transport.Transport.serviceCall(Transport.java:196)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport.handleMessages(TCPTransport.java:587)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run0(TCPTransport.java:828)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.lambda$run$0(TCPTransport.java:705)
        at java.base/java.security.AccessController.doPrivileged(AccessController.java:399)
        at java.rmi/sun.rmi.transport.tcp.TCPTransport$ConnectionHandler.run(TCPTransport.java:704)
        ... 3 more
Using fallback strategy: Compile without Kotlin daemon
Try ./gradlew --stop if this issue persists.

> Task :react-native-screens:compileDebugKotlin FAILED

> Task :react-native-gesture-handler:compileDebugKotlin
w: file:///home/ttpl-rt-132/Tekdi%20projects/Android-learner-app/learner-app/node_modules/react-native-gesture-handler/android/src/main/java/com/swmansion/gesturehandler/core/FlingGestureHandler.kt:25:26 Parameter 'event' is never used
w: Detected multiple Kotlin daemon sessions at kotlin/sessions

FAILURE: Build completed with 2 failures.

1: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':react-native-permissions:compileDebugKotlin'.
> A failure occurred while executing org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction
   > Could not delete '/home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-permissions/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm'

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
==============================================================================

2: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':react-native-screens:compileDebugKotlin'.
> A failure occurred while executing org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction
   > Could not delete '/home/ttpl-rt-132/Tekdi projects/Android-learner-app/learner-app/node_modules/react-native-screens/android/build/kotlin/compileDebugKotlin/cacheable/caches-jvm'

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
==============================================================================

Deprecated Gradle features were used in this build, making it incompatible with Gradle 9.0.

You can use '--warning-mode all' to show the individual deprecation warnings and determine if they come from your own scripts or plugins.

For more on this, please refer to https://docs.gradle.org/8.7/userguide/command_line_interface.html#sec:command_line_warnings in the Gradle documentation.

BUILD FAILED in 1m 13s
446 actionable tasks: 15 executed, 431 up-to-date
