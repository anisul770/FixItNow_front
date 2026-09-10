"use server"


type LoginState = {
    success: true,
    statusCode: number,
    message: string,
    data: {
        accessToken: string,
        refreshToken: string
    }
}

type RegisterResult = {
    success: boolean,
    statusCode: number,
    message: string,
}

export type RegisterState = RegisterResult | null;

export const loginAction = async (prevState: LoginState, formData: FormData) => {
    console.log(prevState);
    const email = formData.get("email");
    const password = formData.get("password");

    const payload = {
        email,
        password
    }
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const result = await res.json();
    return result;
}

export const registerAction = async (initialState: RegisterState, formData: FormData): Promise<RegisterState> => {
    const role = formData.get("role");

    const payload: Record<string, unknown> = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        role: role,
        password: formData.get("password")
    }

    // Technicians carry two extra fields the backend requires for their profile.
    if (role === "TECHNICIAN") {
        payload.experience = Number(formData.get("experience"));
        payload.hourlyRate = Number(formData.get("hourlyRate"));
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const result = await res.json();

        return result;
    } catch {
        return {
            success: false,
            statusCode: 500,
            message: "Could not reach the server. Please try again."
        }
    }
}