const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = '1995Mobuchi@';
  const saltRounds = 12;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUse this hash in your migration file:');
    console.log(`'${hash}'`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();