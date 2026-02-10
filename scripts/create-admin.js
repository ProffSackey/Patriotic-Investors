#!/usr/bin/env node

const readline = require("readline");
const http = require("http");
require("dotenv").config({ path: ".env.local" });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🔐 Patriotic Investors - Admin Account Creation\n");

  try {
    // Get developer token
    const devToken = await question("Developer Token: ");

    if (!devToken) {
      console.log("❌ Developer token is required");
      process.exit(1);
    }

    // Get full name
    const fullName = await question("Full Name: ");
    if (!fullName) {
      console.log("❌ Full name is required");
      process.exit(1);
    }

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    if (!lastName) {
      console.log("❌ Please provide both first and last name");
      process.exit(1);
    }

    // Get role
    console.log("\nAvailable roles:");
    console.log("  1. account-manager");
    console.log("  2. customer-service");
    console.log("  3. executive");

    const roleInput = await question("\nSelect role (1-3): ");
    const roles = {
      "1": "account-manager",
      "2": "customer-service",
      "3": "executive",
    };
    const role = roles[roleInput];

    if (!role) {
      console.log("❌ Invalid role selection");
      process.exit(1);
    }

    // Get email
    const email = await question("Email Address: ");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format");
      process.exit(1);
    }

    // Get password
    const password = await question("Password (min 8 chars): ");
    if (password.length < 8) {
      console.log("❌ Password must be at least 8 characters");
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await question("Confirm Password: ");
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      process.exit(1);
    }

    // Prepare request data
    const data = JSON.stringify({
      username: firstName.toLowerCase() + "_" + lastName.toLowerCase(),
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
    });

    const options = {
      hostname: "localhost",
      port: 3000,
      path: "/api/admin/create-account",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        Authorization: `Bearer ${devToken}`,
      },
    };

    console.log("\n⏳ Creating admin account...\n");

    const req = http.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 201) {
          const result = JSON.parse(responseData);
          console.log("✅ Admin account created successfully!");
          console.log(`\n📋 Account Details:`);
          console.log(`   Username: ${result.admin.username}`);
          console.log(`   Email: ${result.admin.email}`);
          console.log(`   Role: ${result.admin.role}`);
          console.log(`   Created: ${result.admin.createdAt}\n`);
          process.exit(0);
        } else if (res.statusCode === 401) {
          console.log("❌ Invalid developer token\n");
          process.exit(1);
        } else if (res.statusCode === 409) {
          const error = JSON.parse(responseData);
          console.log(`❌ ${error.message}\n`);
          process.exit(1);
        } else {
          const error = JSON.parse(responseData);
          console.log(`❌ Error: ${error.message}\n`);
          process.exit(1);
        }
      });
    });

    req.on("error", (error) => {
      console.log(`❌ Connection error: ${error.message}`);
      console.log("Make sure the development server is running (npm run dev)\n");
      process.exit(1);
    });

    req.write(data);
    req.end();
  } catch (error) {
    console.log(`❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

main().finally(() => {
  rl.close();
});
