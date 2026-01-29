# NextAuth Facebook Login Setup Guide

## ✅ What's Been Implemented

### Authentication System

- ✅ **NextAuth v5** with Facebook OAuth provider
- ✅ **MongoDB Adapter** for session storage
- ✅ **JWT Strategy** for session management
- ✅ **User Model** synced with Mongoose
- ✅ **Role-based Access Control** (admin/user)
- ✅ **Protected Routes** with middleware

### Pages Created

- `/admin/login` - Facebook login page
- `/admin/dashboard` - Admin dashboard (protected)

### Files Created

1. `auth.ts` - NextAuth configuration
2. `lib/mongodb-client.ts` - MongoDB client for adapter
3. `models/User.ts` - User model with roles
4. `app/api/auth/[...nextauth]/route.ts` - Auth API routes
5. `app/admin/login/page.tsx` - Login page
6. `app/admin/dashboard/page.tsx` - Dashboard
7. `middleware.ts` - Route protection
8. `types/next-auth.d.ts` - TypeScript definitions

## 🔧 Setup Instructions

### 1. Get Facebook OAuth Credentials

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new App (type "Consumer" or "None" usually works)
3. Under "Add products to your app", click "Set up" on **Facebook Login**
4. Select "Web"
5. Set your Site URL to `http://localhost:3000` (for development)
6. Go to **Facebook Login** > **Settings** in the left sidebar
7. Under "Valid OAuth Redirect URIs", add: `http://localhost:3000/api/auth/callback/facebook`
8. Go to **App Settings** > **Basic** in the left sidebar to find your **App ID** and **App Secret**
9. Make sure to set your App to **Live** mode if you want others to use it, but for development, it can stay in Sandbox mode.

### 2. Update Environment Variables

Edit `.env.local` and replace the placeholder values:

```bash
# Replace these with your actual Facebook OAuth credentials
FACEBOOK_CLIENT_ID=your-actual-app-id-here
FACEBOOK_CLIENT_SECRET=your-actual-app-secret-here

# Generate a secure secret (run this in terminal):
# openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-here
```

### 3. Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

### 4. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
yarn dev
```

## 🧪 Testing the Authentication

### 1. Visit Login Page

Navigate to: `http://localhost:3000/admin/login`

### 2. Click "Đăng nhập với Facebook"

- You'll be redirected to Facebook's OAuth consent screen
- Log in and grant permissions

### 3. First Login

- You'll be created as a regular user (role: 'user')
- You'll see "Access Denied" message if you try to visit the dashboard directly without being an admin

### 4. Promote to Admin

You need to manually update your user role in MongoDB:

**Option A: Using MongoDB Compass**

1. Connect to your MongoDB
2. Find the `users` collection
3. Find your user by email
4. Change `role` from `"user"` to `"admin"`

**Option B: Using MongoDB Shell**

```javascript
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "admin" } },
);
```

### 5. Login Again

- Sign out and sign in again
- You should now see the admin dashboard

## 🔐 How It Works

### Authentication Flow

1. **User clicks Facebook login** → Redirected to Facebook OAuth
2. **Facebook authenticates** → Returns to callback URL
3. **NextAuth processes** → Creates/updates user in MongoDB
4. **Mongoose sync** → User also saved in Mongoose User model
5. **JWT created** → Contains user ID and role
6. **Session established** → User can access protected routes

### Model Synchronization

The system uses **two storage mechanisms**:

- **NextAuth Collections** (via MongoDB Adapter): `users`, `accounts`, `sessions`
- **Mongoose User Model**: Synced in `auth.ts` logic

This ensures:

- NextAuth has what it needs for authentication
- Your app has full control via Mongoose models
- User roles are managed through your User model

### Role-Based Access

- **Default role**: `user` (cannot access admin)
- **Admin role**: `admin` (full access)
- Middleware checks role on every admin route access

## 📁 Project Structure

```
app/
├── admin/
│   ├── login/
│   │   └── page.tsx          # Login page
│   └── dashboard/
│       └── page.tsx           # Admin dashboard
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts       # Auth handlers
└── components/
    └── SignOutButton.tsx      # Sign out component

lib/
├── mongodb.ts                 # Mongoose connection
└── mongodb-client.ts          # MongoDB client for NextAuth

models/
├── User.ts                    # User model with roles
├── Product.ts                 # Product model
└── Category.ts                # Category model

auth.ts                        # NextAuth configuration
middleware.ts                  # Route protection
types/
└── next-auth.d.ts            # Type definitions
```

## 🎯 Next Steps

1. **Set up Facebook OAuth credentials** (see step 1 above)
2. **Update environment variables**
3. **Test login flow**
4. **Promote your account to admin**
5. **Start building admin features**

## 🛡️ Security Features

✅ JWT-based sessions (no server-side session storage)
✅ Secure HTTP-only cookies
✅ CSRF protection (built into NextAuth)
✅ Role-based access control
✅ Protected routes via middleware
✅ Automatic session refresh

## 🐛 Troubleshooting

### "Error: FACEBOOK_CLIENT_ID not configured"

- Make sure you've added real credentials to `.env.local`
- Restart the dev server after updating env vars

### "Access Denied" after login

- Your account needs admin role
- Update role in MongoDB (see step 4 in Testing)

### Redirect loop

- Check NEXTAUTH_URL matches your actual URL
- Clear browser cookies and try again

### Session not persisting

- Verify NEXTAUTH_SECRET is set
- Check MongoDB connection is working

## 📚 Additional Resources

- [NextAuth Documentation](https://next-auth.js.org/)
- [Facebook Login for Web](https://developers.facebook.com/docs/facebook-login/web)
- [MongoDB Adapter](https://authjs.dev/reference/adapter/mongodb)
