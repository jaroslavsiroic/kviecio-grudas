"use client";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import PocketBase from "pocketbase";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Testimonial } from "@/types";
import { config } from "process";

// initialise client
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export function useDailyMeditation(date: string) {
  return useQuery({
    queryKey: ["daily_meditation"],
    queryFn: async () => {
      return await pb
        .collection("daily_meditation")
        .getFirstListItem(
          `date >= '${date} 00:00:00.000' && date <= '${date} 23:59:59.999'`,
        );
    },
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      return await pb.collection("testimonials").getFullList();
    },
  });
}

export function createUser() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: {
      password: string;
      passwordConfirm: string;
      email: string;
      emailVisibility: boolean;
      name: string;
      info: any;
    }) => {
      await pb.collection("users").create(data);

      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY,
        },
        body: JSON.stringify({
          //TODO finish this one
          attributes: {
            WANT2GETBOOKREAD: true, // TODO add this to the form
            FRATERNITYSTATUS: "status here",
          },
          updateEnabled: false,
          email: data.email,
        }),
      };

      await fetch("https://api.brevo.com/v3/contacts", options);

      // (optional) send an email verification request
      await pb.collection("users").requestVerification(data.email);

      toast.success("Naudotojas sukurtas sėkmingai");
      router.replace("/");
    },
  });
}

export function loginUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const authData = await pb
        .collection("users")
        .authWithPassword(data.email, data.password);

      if (authData) {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.replace("/content");
      }
    },
  });
}

export function getUser() {
  if (pb.authStore.isValid) return pb.authStore.record;
  return null;
}

export function isLoggedIn() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return pb.authStore.isValid;
    },
  });
}

export function logoutUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      pb.authStore.clear();
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.replace("/");
    },
  });
}

export function homepageQuery() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("home");
    },
  });
}
