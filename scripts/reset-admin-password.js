const fs = require('fs').promises;
const path = require('path');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

async function main() {
  const adminsPath = path.join(__dirname, '..', 'data', 'admins.json');

  try {
    const raw = await fs.readFile(adminsPath, 'utf8');
    const admins = JSON.parse(raw);

    const args = process.argv.slice(2);
    const rl = readline.createInterface({ input, output });

    // Ask for email first (per request), then display role before asking password
    let email = args[0];
    let newPassword = args[1];

    if (!email) {
      email = await rl.question('Enter admin email: ');
    }

    // Find admin by email
    const idxByEmail = admins.findIndex((a) => a && a.email === email);
    if (idxByEmail === -1) {
      console.error('No admin found matching email:', email);
      await rl.close();
      process.exit(1);
    }

    // Show role before requesting the new password
    console.log(`Found admin: username=${admins[idxByEmail].username}, role=${admins[idxByEmail].role}`);

    if (!newPassword) {
      newPassword = await rl.question('Enter new password (visible): ');
    }

    const confirm = await rl.question('Confirm new password (visible): ');

    await rl.close();

    if (newPassword !== confirm) {
      console.error('Passwords do not match. Aborting.');
      process.exit(1);
    }

    if (!newPassword || newPassword.length < 6) {
      console.error('Password must be at least 6 characters long. Aborting.');
      process.exit(1);
    }

    // Backup current file
    const backupPath = adminsPath + `.bak-${Date.now()}`;
    await fs.copyFile(adminsPath, backupPath);
    // Update password (note: this project currently stores plaintext passwords)
    admins[idxByEmail].password = newPassword;

    await fs.writeFile(adminsPath, JSON.stringify(admins, null, 2), 'utf8');

    console.log(`Password updated for admin (username: ${admins[idxByEmail].username}, id: ${admins[idxByEmail].id}).`);
    console.log('Backup of previous file:', backupPath);
    console.log('IMPORTANT: Consider migrating to hashed passwords (bcrypt) after this change.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
