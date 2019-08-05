import config from "../config/config";

class EmailController {

    static sendForgotPasswordEmail = async (email: string, newPassword: string) => {
        let CAMPAIGN_ID = 21321213;
        let URL = config.mailchimp.URL + config.mailchimp.FORGOT_PASSWORD_URL;

    }
}

export default EmailController;