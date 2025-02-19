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
import { Partner, Testimonial } from "@/types";
import { config } from "process";

// initialise client
export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export function useDailyMeditation(date: string) {
  const router = useRouter();
  return useQuery({
    queryKey: ["daily_meditation"],
    queryFn: async () => {
      if (pb.authStore.isValid) {
        return await pb
          .collection("dienos_grudas")
          .getFirstListItem(
            `date >= '${date} 00:00:00.000' && date <= '${date} 23:59:59.999'`,
          );
      } else {
        toast.warning("Norėdami peržiūrėti dienos grūdą, prisijunkite");
        router.replace("/login");
        return Promise.resolve(null);
      }
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

export function usePartners() {
  return useQuery<Partner[]>({
    queryKey: ["partners"],
    queryFn: async () => {
      return await pb.collection("partners").getFullList();
    },
  });
}

export function getFileURL(record: any, fileName: string) {
  return pb.files.getURL(record, fileName);
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
          "api-key": process.env.NEXT_PUBLIC_BREVO_API_KEY || "",
        },
        body: JSON.stringify({
          attributes: {
            FIRSTNAME: data?.name,
            WANT2GETBOOKREAD: data?.info?.bookReadNewsletter,
            FRATERNITYSTATUS: data?.info?.areYouPartOfFraternity,
          },
          updateEnabled: false,
          email: data.email,
          listIds: [3],
        }),
      };

      const response = await fetch(
        "https://api.brevo.com/v3/contacts",
        options,
      );
      const json = await response.json();
      // (optional) send an email verification request
      await pb.collection("users").requestVerification(data.email);

      toast.success("Naudotojas sukurtas sėkmingai");
      router.replace("/");
    },
  });
}

export function passwordResetMutation() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await pb
        .collection("users")
        .requestPasswordReset(data.email);
      if (response) {
        toast.success("Laiškas išiųstas į " + data?.email);
        router.replace("/login");
      }
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
        router.replace("/dienos_grudas");
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
    queryKey: ["user", pb.authStore.isValid],
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

// pages:

export function homepageQuery() {
  return useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("home");
    },
  });
}

export function aboutSistersQuery() {
  return useQuery({
    queryKey: ["sisters"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("apieseseris");
    },
  });
}

export function kgShortQuery() {
  return useQuery({
    queryKey: ["kgShort"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("trumpai");
    },
  });
}

export function kgDescriptionQuery() {
  return useQuery({
    queryKey: ["kgDescription"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("apie");
    },
  });
}

export function kgHistoryQuery() {
  return useQuery({
    queryKey: ["kgHistory"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("apiee");
    },
  });
}

export function kgModeratorQuery() {
  return useQuery({
    queryKey: ["kgModerator"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("apieee");
    },
  });
}

export function kgRecommendQuery() {
  return useQuery({
    queryKey: ["kgRecommend"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("rekom");
    },
  });
}

export function contactQuery() {
  return useQuery({
    queryKey: ["kgRecommend"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("kontakt");
    },
  });
}

export function donationQuery() {
  return useQuery({
    queryKey: ["donation"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("parama");
    },
  });
}

export function privacyPolicyQuery() {
  return useQuery({
    queryKey: ["privacyPolicy"],
    queryFn: async () => {
      return await pb.collection("pages").getOne("privacypolicy");
    },
  });
}
