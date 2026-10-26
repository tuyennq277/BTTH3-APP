const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawn, spawnSync} = require('child_process');

const projectDir = path.resolve(__dirname, '..');
const sdkCandidates = [process.env.ANDROID_HOME, process.env.ANDROID_SDK_ROOT,
  path.join(os.homedir(), 'AppData', 'Local', 'Android', 'Sdk'),
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')].filter(Boolean);
const sdkDir = sdkCandidates.find(dir => fs.existsSync(path.join(dir, 'emulator', 'emulator.exe')) &&
  fs.existsSync(path.join(dir, 'platform-tools', 'adb.exe'))) || sdkCandidates[0];
const emulatorDir = path.join(sdkDir, 'emulator');
const platformToolsDir = path.join(sdkDir, 'platform-tools');
const emulator = path.join(emulatorDir, process.platform === 'win32' ? 'emulator.exe' : 'emulator');
const adb = path.join(platformToolsDir, process.platform === 'win32' ? 'adb.exe' : 'adb');
const env = {...process.env, ANDROID_HOME: sdkDir};
const pathKey = Object.keys(env).find(key => key.toLowerCase() === 'path') || 'PATH';
env[pathKey] = [emulatorDir, platformToolsDir, env[pathKey] || ''].join(path.delimiter);

if (process.argv.includes('--check')) {
  console.log(`Android SDK: ${sdkDir}`);
  console.log(`emulator: ${fs.existsSync(emulator) ? emulator : 'chưa cài'}`);
  console.log(`adb: ${fs.existsSync(adb) ? adb : 'chưa cài'}`);
  if (fs.existsSync(emulator)) {
    const result = spawnSync('emulator', ['-list-avds'], {env, encoding: 'utf8'});
    console.log(`Máy ảo:\n${result.stdout || '(không có)'}`);
    if (result.status !== 0) {console.error(result.stderr); process.exitCode = 1;}
  }
} else {
  if (process.argv.includes('--android') && !fs.existsSync(emulator)) {
    console.error('Không tìm thấy Android Emulator. Kiểm tra ANDROID_HOME hoặc cài Android Emulator trong Android Studio.');
    process.exit(1);
  }
  const expoCli = require.resolve('expo/bin/cli');
  const args = ['start', ...process.argv.slice(2)];
  console.log(`Expo dùng Android SDK: ${sdkDir}`);
  const child = spawn(process.execPath, [expoCli, ...args], {cwd: projectDir, env, stdio: 'inherit'});
  child.on('error', error => {console.error(error); process.exitCode = 1;});
  child.on('exit', (code, signal) => {process.exitCode = code || (signal ? 1 : 0);});
}
