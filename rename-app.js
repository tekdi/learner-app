const { execSync } = require('child_process');
const inquirer = require('inquirer').default;
const fs = require('fs');
const path = require('path');

async function main() {
  try {
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
    execSync(`npx react-native-rename \"${appName}\" -b ${packageName}`, {
      stdio: 'inherit',
    });

    // Step 2: Get the app icon path and replace it manually
    const { appIconPath } = await inquirer.prompt([
      {
        name: 'appIconPath',
        message: 'Enter the path for the new app icon:',
        type: 'input',
      },
    ]);

    const iconDest = path.join(__dirname, 'android/app/src/main/res/');
    const iosIconDest = path.join(__dirname, 'ios/');

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
        const destPath = path.join(iconDest, folder, 'ic_launcher.png');
        fs.copyFileSync(appIconPath, destPath);
      });

      console.log(
        'Android icons updated. Replace iOS icons manually in Xcode if needed.'
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

    console.log('Renaming and updates completed successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();
