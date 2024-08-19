"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { Member } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Key, useTransition } from "react";
import MemberCard from "../members/MemberCard";
import Loading from "../components/LoadingComponent";

type Props = {
  members: Member[];
  likeIds: string[];
};

export default function ListsTab({ members, likeIds }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "source", label: "Members I have liked" },
    { id: "target", label: "Members that like me" },
    { id: "mutual", label: "Mutual Likes" },
  ];

  //Key is get from react
  function handleTabChange(key: Key) {
    startTransition(() => {
      //native so no import is needed
      const params = new URLSearchParams(searchParams);
      //setting it to type because thats how its called in actions file
      params.set("type", key.toString());
      //this handles onSelection change
      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col m-10 gap-5">
      <Tabs
        aria-label="Like tabs"
        items={tabs}
        color="secondary"
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <Loading />
            ) : (
              <>
                {members.length > 0 ? (
                  <div className="grid mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
                    {members.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        likeIds={likeIds}
                      />
                    ))}
                  </div>
                ) : (
                  <div>No members found</div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
      ;
    </div>
  );
}
