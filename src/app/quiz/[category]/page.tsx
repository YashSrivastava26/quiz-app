"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Question } from "@/types/types";
import { Dialog } from "@radix-ui/react-dialog";
import axios from "axios";
import { ChevronRightIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type answer = {
  index: number;
  chooseAnswer: string[];
};

export default function Page({ params }: { params: { category: string } }) {
  const [answers, setAnswers] = useState<answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showResult, setshowResult] = useState(false);
  const [currentChoosenAnswer, setCurrentChoosenAnswer] = useState<string[]>(
    []
  );
  const [score, setScore] = useState<number>(0);
  const [ongoingDailogue, setOngoingDialogue] = useState(false);
  const { category } = params;
  const QUIZ_API_KEY = process.env.NEXT_PUBLIC_QUIZ_API_KEY;
  const [question, setQuestion] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("question")) {
      setQuestion(JSON.parse(localStorage.getItem("question")!));
      setCurrentQuestion(JSON.parse(localStorage.getItem("currentQuestion")!));
      setAnswers(JSON.parse(localStorage.getItem("answers")!));
      setLoading(false);
      return;
    }
    axios
      .get(
        `https://quizapi.io/api/v1/questions?apiKey=${QUIZ_API_KEY}&category=${category}`
      )
      .then(function (response) {
        // handle success
        setQuestion(response.data);
        console.log(response.data);
        localStorage.setItem("question", JSON.stringify(response.data));
        localStorage.setItem("currentQuestion", JSON.stringify(0));
        setLoading(false);
      });
  }, []);

  const evaluateAnswer = () => {
    let score = 0;
    answers.forEach((item) => {
      const currentTotalCorrect = Object.values(
        question[item.index].correct_answers
      ).filter((value) => value === "true").length;
      item.chooseAnswer.forEach((answer) => {
        if (
          // @ts-ignore
          question[item.index].correct_answers[`${answer}_correct`]
        ) {
          score += 1 / currentTotalCorrect;
        }
      });
    });
    setScore(score);
  };

  useEffect(() => {
    if (showResult) {
      evaluateAnswer();
    }
  }, [showResult]);

  const handleNextQuestion = () => {
    localStorage.setItem(
      "currentQuestion",
      JSON.stringify(currentQuestion + 1)
    );
    localStorage.setItem(
      "answers",
      JSON.stringify([
        ...answers,
        {
          index: currentQuestion,
          chooseAnswer: currentChoosenAnswer,
        },
      ])
    );
    setAnswers((prev) => [
      ...prev,
      {
        index: currentQuestion,
        chooseAnswer: currentChoosenAnswer,
      },
    ]);
    setCurrentChoosenAnswer([]);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = () => {
    setAnswers((prev) => [
      ...prev,
      {
        index: currentQuestion,
        chooseAnswer: currentChoosenAnswer,
      },
    ]);
    setCurrentChoosenAnswer([]);
    localStorage.removeItem("question");
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("answers");

    setshowResult(true);
  };

  return (
    <div className="flex h-screen items-center justify-center px-8 py-4 2xl:p-0">
      {loading || question.length === 0 ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        <div className="flex rounded-2xl flex-col border border-muted-foreground p-6 pt-4 pb-16 w-full h-full overflow-hidden">
          {showResult ? (
            <div className="flex flex-col items-center justify-center">
              <span>Result</span>
              <span>
                Score: {score}/{question.length}
              </span>
            </div>
          ) : (
            <>
              <div className="h-full overflow-hidden overflow-y-auto scrollbar-w-2 scrollbar-track-secondary scrollbar-thumb-primary scrollbar-thumb-rounded p-2">
                <span className="font-bold w-full">Instructions:</span>
                <ul className="text-sm list-disc pl-4 mb-4 w-full">
                  <li>
                    this question is{" "}
                    <span className="font-bold">multiple correct type</span> and
                    have multiple correct options
                  </li>
                  <li>there is no free navigation between questions</li>
                  <li>
                    Make sure to answer all the questions before submitting
                  </li>
                  <li>
                    if you dont choose any answer, it will be considered as
                    wrong
                  </li>
                </ul>
                <Separator className="bg-muted-foreground/40 mb-4" />
                <div className="flex items-center justify-between w-full gap-x-16 pb-2">
                  <div className="flex flex-col items-end justify-center">
                    <span className="text-xl w-full">
                      {question[currentQuestion].question}
                    </span>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className="h-2 rounded-full w-36 bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${
                            (currentQuestion / question.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs mr-1">
                      Question {currentQuestion + 1}/{question.length}
                    </span>
                  </div>
                </div>
                <Separator className="bg-muted-foreground/40 mb-2" />
                <div className="flex flex-col">
                  {Object.entries(question[currentQuestion].answers).map(
                    ([key, value]) => {
                      if (value) {
                        return (
                          <div
                            key={key}
                            className={cn(
                              "border border-muted-foreground/40 rounded-lg p-4 cursor-pointer my-2 w-full",
                              {
                                "bg-primary/40":
                                  currentChoosenAnswer.includes(key),
                              }
                            )}
                            onClick={() => {
                              if (currentChoosenAnswer.includes(key)) {
                                setCurrentChoosenAnswer((prev) =>
                                  prev.filter((item) => item !== key)
                                );
                              } else {
                                setCurrentChoosenAnswer((prev) => [
                                  ...prev,
                                  key,
                                ]);
                              }
                            }}
                          >
                            {value}
                          </div>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
              </div>

              {currentQuestion !== question.length - 1 && (
                <Button
                  className="absolute bottom-8 right-16 mt-4"
                  onClick={handleNextQuestion}
                >
                  Next <ChevronRightIcon className="h-4 w-4 ml-2" />
                </Button>
              )}

              {currentQuestion === question.length - 1 && (
                <Button
                  className="absolute bottom-8 right-16 mt-4"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </>
          )}
          <Dialog open={ongoingDailogue} onOpenChange={setOngoingDialogue}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  You have an ongoing quiz, please finish it before starting a
                  new one
                </DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
