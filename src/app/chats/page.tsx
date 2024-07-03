import { Separator } from "@/components/ui/separator";
import InvitationBox from "@/components/InvitationBox";
import Conversations from "@/components/Conversations";
import Search from "@/components/Search";
import UserInfo from "@/components/UserInfo";

const ChatsPage = () => {
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
          <div className="sticky top-24 flex flex-col h-full">
            <Search />
            <UserInfo />
          </div>
        </section>
        <section className="w-2/3 flex gap-6">
          <Separator orientation="vertical" />
          <div className="w-full">
            <h2 className="font-bold text-slate-500 text-3xl">
              Your conversations
            </h2>
            <div className="flex justify-between gap-6">
              <Conversations />
              <InvitationBox />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ChatsPage;
