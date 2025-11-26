const fs = require('fs');
const path = require('path');

console.log('🔍 HenMo AI Startup Check\n');

// Check environment file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file missing - copy .env.example to .env and configure');
}

// Check required directories
const requiredDirs = [
  'src/controllers',
  'src/services',
  'src/routes',
  'src/middleware',
  'generated-videos',
  'generated-images',
  'assets'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir} directory exists`);
  } else {
    console.log(`⚠️  Creating ${dir} directory`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Check package.json dependencies
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`✅ Package.json found - ${Object.keys(pkg.dependencies || {}).length} dependencies`);
} else {
  console.log('❌ package.json missing');
}

// Check critical files
const criticalFiles = [
  'src/server.js',
  'src/controllers/auth.controller.js',
  'src/controllers/ai-capabilities.controller.js',
  'src/controllers/media.controller.js',
  'src/routes/auth.routes.js',
  'src/routes/ai-capabilities.routes.js',
  'src/routes/media.routes.js',
  'src/middleware/auth.middleware.js'
];

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
  }
});

console.log('\n🚀 Startup check complete!');
console.log('\nNext steps:');
console.log('1. Configure .env file with your API keys and database credentials');
console.log('2. Run: npm install');
console.log('3. Setup PostgreSQL database');
console.log('4. Run: npm run migrate (if migration scripts exist)');
console.log('5. Run: npm run dev');
console.log('\nTest credentials:');
console.log('Email: ugochukwuhenry16@gmail.com');
console.log('Password: 1995Mobuchi@');
console.log('Role: super_admin');