const fs = require("fs");
const PDFParser = require("pdf2json");
const pdfParser = new PDFParser(this,1);
const { Configuration, OpenAIApi } = require("openai");

const myFunction = async (input) => {
    const output = {};

    let pdf = input.pdf;
    let key = input.key;
    let model = input.model; 
    let prompt = input.prompt; 
    let completion = input.completion;
    let temperature = input.temperature; 
    let max_tokens =  input.max_tokens; 
    let top_p = input.top_p; 
    let frequency_penalty = input.frequency_penalty; 
    let presence_penalty = input.presence_penalty;

        
    async function coupa(input) {
        pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );    
        pdfParser.loadPDF(pdf);

        let patient = await new Promise(async (resolve, reject) => {
            pdfParser.on("pdfParser_dataReady", pdfData => {
                resolve( pdfParser.getRawTextContent().trim());
            });
        });
 
        const configuration = new Configuration({
            apiKey: key,
        });

        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion({
          model: model,
          prompt: prompt + "\n\n" + patient + "\n\n" + completion,
          temperature: temperature,
          max_tokens: max_tokens,
          top_p: top_p,
          frequency_penalty: frequency_penalty,
          presence_penalty: presence_penalty,
        });

        console.log(response.data.choices[0].text)

    	return(response.data.choices[0].text)        
    }

    output.response = await coupa(input);
    return output;

    
}

exports.main = async (input) => {
    return await myFunction(input);

}

const myFunction1 = async () => {
	const input = {};

    let fileInputName = 'invoice1.pdf';
    let pdf = fs.readFileSync(fileInputName);
    const buff = Buffer.from(pdf);
    const base64 = buff.toString('base64');

    input.pdf = base64;
    input.key = 'OPENAI_KEY';
    input.model = 'text-davinci-002';
    input.prompt = 'Extract  invoice number, invoice date, total amount in sgd:';
    input.completion = 'invoice number, invoice date, total amount in sgd:';
    input.temperature = 0.7;
    input.max_tokens = 453;
    input.top_p = 1;
    input.frequency_penalty = 0;
    input.presence_penalty = 0;
   
    var res = await myFunction(input);
    console.log("Result:")
    console.log(res)  
};
myFunction1();
