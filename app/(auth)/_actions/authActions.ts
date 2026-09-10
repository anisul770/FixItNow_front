"use server"


type LoginState = {
    success : true,
    statusCode: number,
    message: string,
    data: {
        accessToken : string,
        refreshToken : string
    }
}

type RegisterResult = {
    success: boolean,
    statusCode: number,
    message: string,
}

export type RegisterState = RegisterResult | null;

export const loginAction = async(initialState: LoginState, formData: FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    }
    // console.log(email,password,payload);

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(payload)
        });
        const result = await res.json();
        console.log({status:res.status,result:result});

        return result;
    } catch (error) {
        console.error("loginAction failed:", error);

        return {
            success : false,
            statusCode : 500,
            message : "Could not reach the server. Please try again."
        }
    }
}

export const registerAction = async(initialState: RegisterState, formData: FormData): Promise<RegisterState> => {
    const payload = {
        name : formData.get("name"),
        email : formData.get("email"),
        phone : formData.get("phone"),
        role : formData.get("role"),
        password : formData.get("password")
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(payload)
        });
        const result = await res.json();

        return result;
    } catch {
        return {
            success : false,
            statusCode : 500,
            message : "Could not reach the server. Please try again."
        }
    }
}