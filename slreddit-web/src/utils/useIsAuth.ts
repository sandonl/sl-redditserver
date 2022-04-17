import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();

  // Redirects to Login if user is not logged in
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login");
    }
  }, [fetching, data, router]);
};
