"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const category = ["Linux", "DevOps", "Docker", "Random"];
  const [categoryChoosen, setCategoryChoosen] = useState("Random");
  const handleCategoryChoosing = (category: string) => {
    setCategoryChoosen(category);

    router.push(`/quiz/${category}`);
  };
  return (
    <main className="min-h-screen max-w-7xl flex justify-center items-center">
      <div className="flex items-center justify-center flex-col">
        <div className="flex items-center justify-center text-2xl">
          Please select tha Catagory of the quiz
        </div>
        <div className="flex flex-wrap">
          {category.map((item, index) => (
            <Dialog key={index}>
              <DialogTrigger asChild>
                <div
                  className="flex items-center justify-center text-white bg-primary rounded-lg m-2 p-4 cursor-pointer hover:bg-secondary hover:text-primary transition-all duration-300 ease-in-out"
                  onClick={() => {}}
                >
                  <span>{item}</span>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sureyou want to start {item} quiz
                  </DialogTitle>
                </DialogHeader>
                <div className="flex gap-x-4 w-full justify-end">
                  <Button onClick={() => handleCategoryChoosing(item)}>
                    Start
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </main>
  );
}
