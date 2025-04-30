"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExecutionRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.push(`/executions?id=${id}`);
    } else {
      router.push("/executions");
    }
  }, [id, router]);

  return null;
}
