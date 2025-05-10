declare namespace FB {
    function login(
        callback: (response: FacebookLoginResponse) => void,
        options?: FacebookLoginOptions
    ): void;

    interface FacebookLoginResponse {
        authResponse?: {
            code: string;
            accessToken: string;
            expiresIn: number;
            grantedScopes: string;
            userID: string;
        };
        status: string;
    }

    interface FacebookLoginOptions {
        config_id?: string;
        response_type?: string;
        override_default_response_type?: boolean;
        extras?: any;
    }
}
