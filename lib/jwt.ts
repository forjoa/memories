import * as jwt from 'jsonwebtoken'

export const generateToken = (payload: object, type: 'access' | 'refresh'): string => {
    const secret: jwt.Secret = type === 'access' ? process.env.JWT_SECRET_ACCESS! : process.env.JWT_SECRET_REFRESH!;
    const options: jwt.SignOptions = type === 'access' ? { expiresIn: '1d' } : { expiresIn: '1y' };
    
    return jwt.sign(payload, secret, options);
}