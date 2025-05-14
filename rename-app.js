const { execSync } = require('child_process');
const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('Initializing... Running npm install...');
    execSync('npm install --force', { stdio: 'inherit' });
    console.log('Dependencies installed successfully!');

    // Step 1: Get new app name and package name
    const { appName, packageName } = await inquirer.prompt([
      {
        name: 'appName',
        message: 'Enter new application name:',
        type: 'input',
      },
      {
        name: 'packageName',
        message: 'Enter new package name:',
        type: 'input',
      },
    ]);

    console.log('Renaming application...');
    execSync(`npx react-native-rename "${appName}" -b ${packageName}`, {
      stdio: 'inherit',
    });

    // Step 2: Get the app icon path and replace it manually
    const { appIconPath } = await inquirer.prompt([
      {
        name: 'appIconPath',
        message: 'Enter the path for the new app icon (PNG file):',
        type: 'input',
      },
    ]);

    const iconDest = path.join(__dirname, 'android/app/src/main/res/');

    if (fs.existsSync(appIconPath)) {
      console.log('Updating app icon manually...');

      const androidIconFolders = [
        'mipmap-hdpi',
        'mipmap-mdpi',
        'mipmap-xhdpi',
        'mipmap-xxhdpi',
        'mipmap-xxxhdpi',
      ];

      androidIconFolders.forEach((folder) => {
        const launcherPath = path.join(iconDest, folder, 'ic_launcher.png');
        const roundLauncherPath = path.join(
          iconDest,
          folder,
          'ic_launcher_round.png'
        );
        const foregroundPath = path.join(
          iconDest,
          folder,
          'ic_launcher_foreground.png'
        );
        fs.copyFileSync(appIconPath, launcherPath);
        fs.copyFileSync(appIconPath, roundLauncherPath);
        fs.copyFileSync(appIconPath, foregroundPath);
      });

      console.log(
        'Android icons updated. Run the following to clean the build:'
      );
      console.log(
        'cd android && ./gradlew clean && cd .. && npx react-native run-android'
      );
    } else {
      console.log('Invalid app icon path. Skipping icon update.');
    }

    // Step 3: Get the new logo path and replace it in src/assets/images/png
    const { logoPath } = await inquirer.prompt([
      {
        name: 'logoPath',
        message: 'Enter the path for the new logo:',
        type: 'input',
      },
    ]);

    const logoDest = path.join(__dirname, 'src/assets/images/png/logo.png');
    if (fs.existsSync(logoPath)) {
      console.log('Replacing logo...');
      fs.copyFileSync(logoPath, logoDest);
      console.log('Logo replaced successfully.');
    } else {
      console.log('Invalid logo path. Skipping logo update.');
    }

    // Step 4: Get the google-services.json file path and replace it in android/app/
    const { googleServicesPath } = await inquirer.prompt([
      {
        name: 'googleServicesPath',
        message: 'Enter the path for the new google-services.json file:',
        type: 'input',
      },
    ]);

    const googleServicesDest = path.join(
      __dirname,
      'android/app/google-services.json'
    );
    if (fs.existsSync(googleServicesPath)) {
      console.log('Replacing google-services.json file...');
      fs.copyFileSync(googleServicesPath, googleServicesDest);
      console.log('google-services.json file replaced successfully.');
    } else {
      console.log('Invalid google-services.json path. Skipping update.');
    }

    console.log('Renaming and updates completed successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
