import { Testimonials } from "@/app/[locale]/(landing)/components";
import { profile } from "console";
import { title } from "process";

export default {
  Header: {
    title: "Rental Rate",
  },
  Sidebar: {
    title: "Rental Rate",
    landlordInformation: "Informacje o wynajmującym",
    showDetails: "Dowiedz się więcej",
    loginToAddOpinion: "Zaloguj się, aby dodać opinię",
    loginToAddLandlord: "Zaloguj się, aby dodać wynajmującego",
    signIn: "Zaloguj się",
    signUp: "Zarejestruj się",
    version: "wersja",
    selectedAddress: "Wybrany adres",
    addNewLandlord: "Dodaj nowego wynajmującego",
    addNewOpinion: "Dodaj nową opinię",
    search: "Szukaj",
    profile: "Profil",
    logout: "Wyloguj",
    processing: "Przetwarzanie...",
  },
  AutosuggestInput: {
    placeholder: "Wyszukaj lokalizację",
    noSuggestions: "Brak pasujących sugestii",
  },
  Login: {
    title: "Zaloguj się",
    description:
      "Wprowadź swój adres e-mail poniżej, aby zalogować się do swojego konta",
    noAccount: "Nie masz konta? ",
    signUp: "Zarejestruj się",
    email: "E-mail",
    password: "Hasło",
    emailPlaceholder: "Twój adres e-mail",
    passwordPlaceholder: "Twoje hasło",
    loginWithGoogleCommingSoon: "Logowanie za pomocą Google wkrótce!",
    loginWithGoogle: "Zaloguj się za pomocą Google",
    or: "lub",
  },
  Register: {
    title: "Zarejestruj się",
    description: "Wprowadź swój adres e-mail poniżej, aby stworzyć nowe konto",
    alreadySignedUp: "Masz już konto?",
    signIn: "Zaloguj się",
    signUp: "Zarejestruj się",
    email: "E-mail",
    password: "Hasło",
    confirmPassword: "Potwierdź hasło",
    emailPlaceholder: "Twój adres e-mail",
    passwordPlaceholder: "Twoje hasło",
    confirmPasswordPlaceholder: "Potwierdź hasło",
    loginWithGoogleCommingSoon: "Logowanie za pomocą Google wkrótce!",
    loginWithGoogle: "Zaloguj się za pomocą Google",
    or: "lub",
  },
  Profile: {
    title: "Profil",
    changeAvatar: "Zmień awatar",
    username: "Nazwa użytkownika",
    accountStatus: "Status konta",
    verified: "Zweryfikowany",
    noUsername: "Nie ustawiłeś jeszcze nazwy użytkownika",
    enterUsername: "Wprowadź swoją nazwę użytkownika",
    save: "Zapisz",
    cancel: "Anuluj",
    processing: "Przetwarzanie...",
  },
  LandlordPage: {
    lastReviews: "Ostatnie opinie",
    showMore: "Pokaż więcej",
    writeAnOpinion: "Napisz opinię",
    showOnMap: "Pokaż na mapie",
    share: "Udostępnij",
    alert: {
      title: "Dodałeś nowego wynajmującego!",
      message:
        "Pomyślnie dodałeś informacje o wynajmującym do naszej bazy danych. Możesz zarządzać infomacjami na tej stronie. ",
      cta: "Dodaj również pierwszą opinię o tym wynajmującym",
      here: "tutaj",
    },
    edit: "Edytuj",
    delete: "Usuń",
    addFirstOpinion: "Dodaj pierwszą opinię",
    uploadPhoto: "Prześlij zdjęcie",
    deleteAlert: {
      title: "Czy na pewno chcesz usunąć tego wynajmującego?",
      message: "Tej operacji nie można cofnąć. Dane zostaną utracone.",
    },
    deleting: "Usuwanie...",
    cancel: "Anuluj",
    noReviews: "Brak opinii",
    copied: "Link został skopiowany!",
  },
  LandingPage: {
    navbar: {
      title: "RentalRate",
      features: "Funkcje",
      testimonials: "Opinie",
      signIn: "Zaloguj się",
      profile: "Profil",
    },
    hero: {
      title: "Oceń swojego wynajmującego",
      title2: "i pomóż innym",
      subtitle:
        "Podejmij świadomą decyzję dotyczące swojego następnego domu. Autentyczne recenzje wynajmujących od prawdziwych najemców. ",
      cta: "Przejdź do aplikacji",
      verifiedReviews: "Zweryfikowane opinie",
      verifiedReviewsDescription:
        "Prawdziwe doświadczenia od prawdziwych najemców",
      safeAndSecure: "Bezpieczne i poufne",
      safeAndSecureDescription: "Chronimy tożsamość i uczciwe opinie",
      communityDriven: "Stworzone przez społeczność",
      communityDrivenDescription: "Rozwijająca się sieć doświadczeń najemców",
    },
    features: {
      title: "Wszystko, czego potrzebujesz, aby podjąć świadomą decyzję",
      subtitle: "Znajdź idealne wynajem na podstawie doświadczeń innych",
      comprehensiveSearch: "Kompleksowe wyszukiwanie",
      comprehensiveSearchDescription:
        "Wyszukaj po adresie, dzielnicy lub nazwie wynajmującego, aby znaleźć szczegółowe recenzje i oceny.",
      detailedReviews: "Szczegółowe recenzje",
      detailedReviewsDescription:
        "Dowiedz się o konserwacji, komunikacji i ogólnym doświadczeniu wynajmu od poprzednich najemców.",
      ratingTrends: "Trendy ocen",
      ratingTrendsDescription:
        "Sprawdź historyczne trendy ocen i śledź poprawy lub spadki w wydajności wynajmującego.",
      verifiedReviews: "Zweryfikowane recenzje",
      verifiedReviewsDescription:
        "Zaufaj naszemu procesowi weryfikacji, zapewniającemu autentyczne recenzje od prawdziwych najemców.",
    },
    testimonials: {
      title: "Opinie naszych użytkowników",
    },
    footer: {
      title: "RentalRate",
      description:
        "Zapewniamy najemcom wiedzę i przejrzystość na rynku wynajmu.",
      about: "O nas",
      contact: "Kontakt",
      terms: "Regulamin",
      privacy: "Polityka prywatności",
      connectWithUs: "Skontaktuj się z nami",
      quickLinks: "Linki",
      allRightsReserved: "Wszelkie prawa zastrzeżone",
    },
  },
  VerifyEmail: {
    title: "Zweryfikuj swój adres e-mail",
    message:
      "Link weryfikacyjny został wysłany na Twój adres e-mail. Sprawdź swoją skrzynkę odbiorczą i kliknij w link, aby zweryfikować swoje konto.",
    didntReceiveEmail:
      "Nie otrzymałeś e-maila? Sprawdź folder spam lub kliknij poniżej, aby ponownie wysłać.",
    resendEmail: "Wyślij ponownie e-mail weryfikacyjny",
    returnToHomePage: "Powrót do ",
    homePage: "Strony głównej",
  },
} as const;
