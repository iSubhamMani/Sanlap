"use client";

import SearchedUser from "@/components/SearchedUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/hooks";
import { LogOut, SearchIcon, UserRound } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { User } from "@/models/user.model";
import Loader from "@/components/Loader";

import { debounce } from "lodash";
import InvitationBox from "@/components/InvitationBox";

const ChatsPage = () => {
  const { info } = useAppSelector((state) => state.user);

  const [state, setState] = useState({
    searchQuery: "",
    searchResults: [],
    searchLoading: false,
  });

  const searchUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/search/${info?.uid}?q=${state.searchQuery}`
      );

      if (response.data?.success) {
        setState((prevState) => ({
          ...prevState,
          searchResults: response.data.data,
        }));
      }
    } catch (error) {
      console.log("Something went wrong: ", error);
    } finally {
      setState((prevState) => ({ ...prevState, searchLoading: false }));
    }
  }, [info?.uid, state.searchQuery]);

  const debouncedSearch = useMemo(
    () => debounce(searchUser, 400),
    [searchUser]
  );

  useEffect(() => {
    if (!state.searchQuery.trim()) {
      setState((prevState) => ({
        ...prevState,
        searchLoading: false,
        searchResults: [],
      }));
      return;
    }

    setState((prevState) => ({ ...prevState, searchLoading: true }));
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [state.searchQuery, debouncedSearch]);

  return (
    <div className="min-h-[100dvh] flex flex-col px-6 md:px-16 pt-4 md:pt-6 pb-8">
      <header className="mb-8 sticky top-6">
        <div>
          <h1 className="text-primary text-3xl font-bold tracking-tighter sm:text-4xl xl:text-4xl/none">
            Sync
          </h1>
        </div>
      </header>
      <main className="flex flex-1">
        <section className="w-1/3 pr-6">
          <div className="sticky top-24 flex flex-col">
            <div className="relative max-w-[95%] flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users"
                className="pl-9 h-9 w-full"
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    searchQuery: e.target.value,
                  }))
                }
              />
              <ScrollArea className="mt-6 mb-8 h-[600px] w-full">
                <div className="pr-4">
                  {state.searchLoading ? (
                    <div className="mt-6 flex justify-center">
                      <Loader />
                    </div>
                  ) : state.searchResults.length === 0 ? (
                    state.searchQuery.trim() !== "" &&
                    !state.searchLoading && (
                      <p className="text-slate-500 text-center">
                        No users found for{" "}
                        <span className="font-bold">{state.searchQuery}</span>
                      </p>
                    )
                  ) : (
                    state.searchResults.map((user: User) => (
                      <SearchedUser
                        key={user._id}
                        user={user}
                        currentUser={info}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={info?.photoURL} />
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-light">Currently logged in as</p>
                  <p className="text-base font-medium">{info?.displayName}</p>
                </div>
              </div>
              <div>
                <LogOut />
              </div>
            </div>
          </div>
        </section>
        <section className="w-2/3 flex gap-6">
          <Separator orientation="vertical" />
          <InvitationBox />
        </section>
      </main>
    </div>
  );
};

export default ChatsPage;
