import { ProfileTypes } from '@sanfrancisco/users/profiles.enum';
export declare class LoginDTO {
    email: string;
    password: string;
    sucursalId: number;
    rememberme: boolean;
    device: any;
    scope: ProfileTypes;
}
