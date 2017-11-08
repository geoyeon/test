const fs = require("fs");

let str = "";

for(let i=1;i<10;i++)
{
    for(let j=2;j<10;j+=2)
    {
        let gu_str = j + "*" + i + "=" + (j*i);

        str += gu_str + "\t";

        //console.log(j + "*" + i + "=" + (j*i));
    }

    str += "\n";
}

str += "\n";

for(let i=1;i<10;i++)
{
    for(let j=3;j<10;j+=2)
    {
        let gu_str = j + "*" + i + "=" + (j*i);

        str += gu_str + "\t";

        //console.log(j + "*" + i + "=" + (j*i));
    }

    str += "\n";
}

console.log(str);

fs.writeFileSync(__dirname + "/gugudan.txt",str,"utf8");