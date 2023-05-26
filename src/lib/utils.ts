import { ClassValue } from "class-variance-authority/dist/types";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs))
}