import { link } from "fs";

export default {
  Header: {
    title: "Rental Rate",
  },
  Sidebar: {
    title: "Rental Rate",
    landlordInformation: "Landlord Information",
    showDetails: "Show details",
    loginToAddOpinion: "Login to add an opinion",
    loginToAddLandlord: "Login to add a landlord",
    signIn: "Sign In",
    signUp: "Sign Up",
    version: "version",
    selectedAddress: "Selected Address",
    addNewLandlord: "Add New Landlord",
    addNewLandlordDescription: "Enter the details for the new landlord here.",
    addNewOpinion: "Add New Opinion",
    search: "Search",
    profile: "Profile",
    logout: "Logout",
    processing: "Processing...",
    streetNumber: "Number",
    flatNumber: "Flat Number",
    city: "City",
    zipCode: "Zip Code",
  },
  AutosuggestInput: {
    placeholder: "Search for a location",
    noSuggestions: "No matching suggestions found",
  },
  Login: {
    title: "Login",
    description: "Enter your email below to login to your account",
    noAccount: "Don't have an account? ",
    signUp: "Sign up",
    email: "Email",
    password: "Password",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Your password",
    loginWithGoogleCommingSoon: "Login with Google coming soon!",
    loginWithGoogle: "Login with Google",
    or: "or continue with",
  },
  Register: {
    title: "Create an account",
    description: "Enter your email below to create your account",
    alreadySignedUp: "Already have an account? ",
    signIn: "Sign in",
    signUp: "Sign up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    emailPlaceholder: "Your email",
    passwordPlaceholder: "Your password",
    confirmPasswordPlaceholder: "Confirm your password",
    loginWithGoogleCommingSoon: "Login with Google coming soon!",
    loginWithGoogle: "Login with Google",
    or: "or continue with",
  },
  Profile: {
    title: "Profile",
    changeAvatar: "Change Avatar",
    username: "Username",
    accountStatus: "Account Status",
    verified: "Verified",
    noUsername: "You have not set a username yet",
    enterUsername: "Enter your username",
    save: "Save",
    cancel: "Cancel",
    processing: "Processing...",
  },
  LandlordPage: {
    lastReviews: "Last reviews",
    showMore: "Show more",
    writeAnOpinion: "Write an opinion",
    showOnMap: "Show on map",
    share: "Share",
    alert: {
      title: "You have added a new landlord!",
      message:
        "You have successfully added information about the landlord to our database. You can manage the information on this page. Also, feel free to add the first opinion about this landlord here.",
      cta: "Also, feel free to add the first opinion about this landlord",
      here: "here",
    },
    edit: "Edit",
    delete: "Delete",
    addFirstOpinion: "Add first opinion",
    uploadPhoto: "Upload photo",
    deleteAlert: {
      title: "Are you absolutely sure?",
      message:
        "This action cannot be undone. This will permanently delete the landlord and all associated reviews.",
    },
    deleting: "Deleting...",
    cancel: "Cancel",
    noReviews: "No reviews yet",
    copied: "Copied to clipboard!",
  },
  LandingPage: {
    navbar: {
      title: "RentalRate",
      features: "Features",
      testimonials: "Testimonials",
      signIn: "Sign In",
      profile: "Profile",
    },
    hero: {
      title: "Rate Your Rental Experience",
      title2: "Empower Future Tenants",
      subtitle:
        "Make informed decisions about your next home. Read and share authentic landlord reviews from real tenants.",
      cta: "Get Started",
      verifiedReviews: "Verified Reviews",
      verifiedReviewsDescription: "Real experiences from real tenants",
      safeAndSecure: "Safe & Secure",
      safeAndSecureDescription: "Protected identity and honest feedback",
      communityDriven: "Community Driven",
      communityDrivenDescription: "Growing network of tenant experiences",
    },
    features: {
      title: "Everything you need to make informed decisions",
      subtitle: "Find the perfect rental by learning from others' experiences",
      comprehensiveSearch: "Comprehensive Search",
      comprehensiveSearchDescription:
        "Search by address, neighborhood, or landlord name to find detailed reviews and ratings.",
      detailedReviews: "Detailed Reviews",
      detailedReviewsDescription:
        "Get insights on maintenance, communication, and overall rental experience from previous tenants.",
      ratingTrends: "Rating Trends",
      ratingTrendsDescription:
        "View historical rating trends and track improvements or declines in landlord performance.",
      verifiedReviews: "Verified Reviews",
      verifiedReviewsDescription:
        "Trust our verification process ensuring authentic reviews from real tenants.",
    },
    testimonials: {
      title: "What our users are saying",
    },
    footer: {
      title: "RentalRate",
      description:
        "Empowering tenants with knowledge and transparency in the rental market.",
      about: "About",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      connectWithUs: "Connect With Us",
      quickLinks: "Quick Links",
      allRightsReserved: "All rights reserved",
    },
  },
  VerifyEmail: {
    title: "Verify Your Email",
    message:
      "A verification link has been sent to your email address. Please check your inbox and click on the link to verify your account.",
    didntReceiveEmail:
      "Didn't receive the email? Check your spam folder or click below to resend.",
    resendEmail: "Resend Verification Email",
    returnToHomePage: "Return to ",
    homePage: "Home page",
  },
  ReviewPage: {
    share: "Share",
    flagReview: "Flag review",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    linkCopied: "Link copied to clipboard",
    comingSoon: "This feature is coming soon!",
    report: "Report",
  },
  AddReviewPage: {
    title: "Add Review",
    editTitle: "Edit Review",
    reviewContent: "Review Content",
    reviewContentDescription: "Share your experience with the landlord",
    reviewContentDescription2:
      "Provide details about your experience with the landlord.",
    rating: "Rating",
    ratingDescription: "Rate your landlord from 1 to 5 stars.",
    submit: "Submit Review",
    processing: "Processing...",
    contentMessage: "Content must be at least 10 characters.",
    pickRating: "Pick a rating",
  },
} as const;
