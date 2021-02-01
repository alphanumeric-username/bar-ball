function test(caseName: string, testingFunction: (...any) => any, input: any[], expectedOutput: any): boolean {
    const output = testingFunction(...input);

    console.log('CASE:', caseName);
    console.log('expected:', expectedOutput);
    console.log('but got:', output, '\n');

    return output == expectedOutput;
}

export {
    test
};