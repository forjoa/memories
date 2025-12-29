import { Secret, sign, SignOptions, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

interface UserPayload {
    id: string;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export const generateToken = (payload: object, type: 'access' | 'refresh'): string => {
    const secret: Secret = type === 'access' ? process.env.JWT_SECRET_ACCESS! : process.env.JWT_SECRET_REFRESH!;
    const options: SignOptions = type === 'access' ? { expiresIn: '1d' } : { expiresIn: '1y' };

    return sign(payload, secret, options);
}

export const verifyToken = async (req: NextRequest, type: 'access' | 'refresh') => {
    const token = req.cookies.get(type === 'access' ? 'accessToken' : 'refreshToken');
    const tokenVerified = verify(token?.value!, type === 'access' ? process.env.JWT_SECRET_ACCESS! : process.env.JWT_SECRET_REFRESH!, { complete: true });
    
    console.log(`[PROXY] by access ${JSON.stringify(tokenVerified.payload)}`);
}