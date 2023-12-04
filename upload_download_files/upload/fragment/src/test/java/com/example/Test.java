package com.example;

/**
 * @author flowerwine
 * @date 2023 年 12 月 03 日
 */
public class Test {
    public static String judgeLevel(int examScore, int internalScore) {
        int overallMark = examScore + internalScore;
        if(overallMark > 100 || examScore > 70 || internalScore > 30) {
            System.out.println("Error");
            return "Error";
        }
        overallMark = overallMark / 10;
        switch (overallMark) {
            case 10:
            case 9: return "A";
            case 8: return "B";
            case 7:
            case 6: return "C";
            default: return "D";
        }
    }

    public static void main(String[] args) {
        System.out.println(judgeLevel(70, 20));
        System.out.println(judgeLevel(65, 15));
        System.out.println(judgeLevel(60, 10));
    }
}
