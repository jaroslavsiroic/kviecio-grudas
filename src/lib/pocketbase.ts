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

// initialise client
export const pb = new PocketBase("https://kviecio-grudas-test-pb.fly.dev");

export function useDailyMeditation(date: string) {
  return useQuery({
    queryKey: ["daily_meditation"],
    queryFn: async () => {
      return await pb
        .collection("daily_meditation")
        .getFirstListItem(
          `date >= '${date} 00:00:00.000' && date <= '${date} 23:59:59.999'`
        );
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
      firstName: string;
      lastName: string;
    }) => {
      await pb.collection("users").create(data);

      // (optional) send an email verification request
      await pb.collection("users").requestVerification(data.email);

      toast.success("Naudotojas sukurtas sėkmingai");
      router.replace("/login");
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
