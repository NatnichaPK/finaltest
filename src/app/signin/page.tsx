"use client";
import { Typography, Stack, TextField, Button, Link } from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";

export default function page() {
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
        });
        if (res?.status === 200) {
            location.href = "/";
        } else {
            alert("Login failed. Please check your credentials.");
        }
    }

    return (
        <>
            <Typography variant="h2">This is Sign-in page</Typography>
            <Link href="/signup">Signup</Link>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Stack
                    width={400}
                    justifyContent="center"
                    alignItems="center"
                    margin="auto auto"
                    spacing={1}
                >
                    <TextField
                        name="email"
                        label="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                    <TextField
                        type="password"  // เพิ่ม type เป็น password เพื่อซ่อนข้อมูล
                        name="password"
                        label="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                    <Button type="submit">Submit</Button>
                </Stack>
            </form>
        </>
    );
}
