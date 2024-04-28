let _ = require('lodash');
let moment = require('moment');
const constants = require('../../constants.js');

class SpotifyHelper extends require('./BaseHelper.js') {
    constructor(props) {
        super(props);
        
        this.auth = null;
        this.refresh = null;
        this.expires = null;
        this.codeVerifier = null;
        this.code = null;
        this.accessToken = null
    }

    async getAuthToken() {
        let token =  await this.#getSpotifyToken();
        if (this.expires < moment().unix()){
            await this.#refreshSpotifyToken()
        }
        return this.accessToken;
    }

    async getExpires() {
        let token =  await this.#getSpotifyToken();
        return this.expires;
    }

    async isTokenValid(){
        if (this.auth){
            if ((value.expires) < moment().unix()) {
                return false;
            } else if ((value.expires - 600) < moment().unix()) {
                await this.#refreshSpotifyToken();
                return true;
            } else {
                return true;
            }
        }
        return false
    }

    async #getSpotifyAuth() {
        this.#generateSpotifyToken();
        switch (await this.#checkSpotifyToken()){
            case 'missing':
            case 'expired':
                return await this.#generateSpotifyToken();
                break;
            case 'refresh':
                await this.#refreshSpotifyToken();
                break;
            default:
                break;
        }
        if (!this.auth){
            let values = await this.#getSpotifyToken();
            this.auth= values?.auth;
            this.refresh = values?.refresh;
            this.expires = values?.expires;
        }
        return this.auth;
    }

    async generateSpotifyOauth(){
        return await this.#generateSpotifyToken();
    }

    async #generateSpotifyToken(){
        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }
        
        const codeVerifier  = generateRandomString(64);
        
        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return crypto.subtle.digest('SHA-256', data)
        }
        
        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        }

        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);
        
        const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';
        const authUrl = new URL("https://accounts.spotify.com/authorize")

        this.codeVerifier = codeVerifier;

        await this.#setSpotifyToken();

        const params =  {
            response_type: 'code',
            client_id: constants.spotify.client_id,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: constants.spotify.callbackUrl,
        }

        authUrl.search = new URLSearchParams(params).toString();

        return authUrl.toString();
    
    }

    async apiCallback (code) {
        this.code = code;
        console.log(this.code);
        await this.#setSpotifyToken();
        await this.#getSpotifyToken();
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: constants.spotify.client_id,
                grant_type: 'authorization_code',
                code: this.code,
                redirect_uri: constants.spotify.callbackUrl,
                code_verifier: this.codeVerifier,
            }),
        }

        const body = await fetch(`https://accounts.spotify.com/api/token`, payload);
        const response = await body.json();

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expires = moment().unix() + response.expires_in;
        await this.#setSpotifyToken();

        console.log(response);
        return  response;
    }

    async #refreshSpotifyToken(){
        await this.#getSpotifyToken();
        console.log(this.refresh);
       
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refresh,
                client_id: constants.spotify.client_id,
            }),
        }
        const body = await fetch(`https://accounts.spotify.com/api/token`, payload);
        const response = await body.json();

        console.log('refresh',response)

        this.accessToken = response.access_token;
        this.expires = moment().unix() + response.expires_in;
        await this.#setSpotifyToken();
        return this.#getSpotifyToken()
    }

    async #checkSpotifyToken() {
        let value = await this.#getSpotifyToken();
        if (!value) { return 'missing'; }
        if (value.expires < moment().unix()) { return 'refresh'; }
        return 'valid';
    }

    async #getSpotifyToken() {
        let setting = await this._getModel('vanSettings');
        let spotify  = await setting.find(3);;
        let value = JSON.parse(spotify.value);
        this.auth = value?.auth,
        this.refresh = value?.refresh,
        this.expires = value?.expires,
        this.codeVerifier = value?.codeVerifier,
        this.code = this.code ?? value?.code,
        this.accessToken = value?.accessToken
        return value;
    }

    async #setSpotifyToken() {
        let setting = await this._getModel('vanSettings');
        let spotify  = await setting.find(3);
        let value = JSON.parse(spotify.value);
        return await spotify.update(
            {
                ...spotify, 
                value: JSON.stringify({
                    auth: this.auth ?? value?.auth,
                    refresh: this.refresh ?? value?.refresh,
                    expires: this.expires ?? value?.expires,
                    codeVerifier:this.codeVerifier ?? value?.codeVerifier,
                    code: this.code ?? value?.code,
                    accessToken: this.accessToken ?? value?.accessToken
                })
            }
        )
    }


}

module.exports = new SpotifyHelper();