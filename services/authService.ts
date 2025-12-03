import { AuthUser, UserType, ConsumerProfile, InvestorProfile } from '../types';

const STORAGE_KEY_AUTH = 'agrishare_auth_data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  // --- NOUVEAU FLUX MOBILE-FIRST ---

  // 1. Vérifier si le numéro existe déjà
  checkUserExists: async (phone: string): Promise<boolean> => {
    await delay(800);
    // Simulation: Les numéros commençant par 77 ou 701234567 existent déjà pour la démo
    // Dans une vraie app, appel API backend
    return phone.startsWith('77') || phone === '701234567';
  },

  // 2. Envoyer le code OTP (Simulation)
  sendVerificationCode: async (phone: string): Promise<boolean> => {
    await delay(1000);
    console.log(`CODE OTP pour ${phone}: 123456`); // Pour le debug
    return true;
  },

  // 3. Vérifier le code OTP
  verifyCode: async (phone: string, code: string): Promise<boolean> => {
    await delay(1000);
    return code === '123456';
  },

  // 4. Finaliser l'inscription (Profil Rapide)
  completeRegistration: async (phone: string, fullName: string, userType: UserType): Promise<AuthUser> => {
    await delay(1500);
    
    const user: AuthUser = {
      id: `${userType}-${Date.now()}`,
      phone: phone,
      fullName: fullName,
      type: userType,
      farmName: userType === UserType.FARMER ? `${fullName.split(' ')[0]}'s Farm` : undefined,
      token: 'access-token-' + Date.now(),
      refreshToken: 'refresh-token-' + Date.now(),
      profileData: {} 
    };
    
    // Initialiser des données par défaut selon le rôle
    if (userType === UserType.CONSUMER) {
      user.profileData = { deliveryAddress: 'Dakar, Sénégal', preferences: [] } as ConsumerProfile;
    } else if (userType === UserType.INVESTOR) {
      user.profileData = { budgetRange: '1M - 5M', sectors: [] } as InvestorProfile;
    }

    authService.saveSession(user);
    return user;
  },

  // --- ANCIENNES MÉTHODES (Compatibilité & Login Classique) ---

  login: async (phone: string, password: string): Promise<AuthUser> => {
    await delay(1000);
    
    // Simulation simple pour les utilisateurs existants
    let type = UserType.CONSUMER;
    if (phone.startsWith('77')) type = UserType.FARMER;
    else if (phone.startsWith('70')) type = UserType.INVESTOR;

    // Accepte n'importe quel mot de passe > 3 chars pour la démo
    if (password.length >= 4) {
       const user: AuthUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        phone: phone,
        fullName: type === UserType.FARMER ? 'Moussa Diop' : type === UserType.INVESTOR ? 'Jean Investor' : 'Fatou Consumer',
        type: type,
        farmName: type === UserType.FARMER ? 'Ferme de la Vallée' : undefined,
        token: 'access-token-' + Date.now(),
        refreshToken: 'refresh-token-' + Date.now()
      };
      authService.saveSession(user);
      return user;
    }
    throw new Error("Mot de passe incorrect");
  },

  autoLogin: async (): Promise<AuthUser | null> => {
    const storedData = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!storedData) return null;
    const user = JSON.parse(storedData) as AuthUser;
    if (!navigator.onLine) return user;
    try {
      await delay(500);
      return user; 
    } catch (error) {
      return null;
    }
  },

  saveSession: (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  getCachedPhone: (): string => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AUTH);
      if (data) {
        return JSON.parse(data).phone || '';
      }
      return '';
    } catch (e) { return ''; }
  }
};