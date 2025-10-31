export class Sorter{
    list: any;

    constructor(anyList: any){
        this.list = anyList;
    }

    bubbleSort(typeValue: string){
        let n: number, i: number, k: number, aux: any;
        n = this.list.length;
        // Algoritmo de burbuja
        for (k = 1; k < n; k++) {
            for (i = 0; i < (n - k); i++) {
                if (this.compareValues(typeValue,this.list[i], this.list[i + 1])) {
                    aux = this.list[i];
                    this.list[i] = this.list[i + 1];
                    this.list[i + 1] = aux;
                }
            }
        }
        console.log("Lista ordenada: ", this.list);// Mostramos, por consola, la lista ya ordenada
        return this.list;
    }

    compareValues(typeValue:string, evaluatedValue1: any, evaluatedValue2: any){
        switch(typeValue){
            case 'altaRegistro':
                let date1, date2;
                try{
                    date1 = this.stringToDate(evaluatedValue1.altaRegistro);
                    date2 = this.stringToDate(evaluatedValue2.altaRegistro);
                }catch(e){
                    console.log(e);
                    date1 = Date.parse(evaluatedValue1.altaRegistro);
                    date2 = Date.parse(evaluatedValue2.altaRegistro);
                }
                console.log("fechas: " + date1 + date2);
                return  date1 > date2;
            default:
                return evaluatedValue1 > evaluatedValue2;
        }
    }

    stringToDate(value:string){
        let day = parseInt(value.substring(0, 2),10);
		let month = parseInt(value.substring(3, 5),10);
		let year = parseInt(value.substring(6,10),10);
		let hour = parseInt(value.substring(11,13),10);
		let minute = parseInt(value.substring(14,16),10);
		let second = parseInt(value.substring(17,19),10);
        return new Date(year,month-1,day,hour,minute,second);
    }
}