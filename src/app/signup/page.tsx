"use client";
import { Button, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { FormEvent } from "react";

export default function page() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      // ตรวจสอบ response
      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        alert("Error: " + errorData.message);
      } else {
        alert("Sign up successful!");
        // Redirect or clear form here if needed
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while signing up.");
    }
  };

  return (
    <>
      <Typography variant="h2">This is sign-up page</Typography>

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
            name="password"
            label="password"
            type="password"  // เพิ่ม type เป็น password เพื่อซ่อนข้อมูล
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
