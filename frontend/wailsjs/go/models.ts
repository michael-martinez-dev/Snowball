export namespace debt {
	
	export class DebtItem {
	    name: string;
	    type: string;
	    link: string;
	    total: string;
	    monthly: string;
	    due: string;
	    interest: string;
	
	    static createFrom(source: any = {}) {
	        return new DebtItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.type = source["type"];
	        this.link = source["link"];
	        this.total = source["total"];
	        this.monthly = source["monthly"];
	        this.due = source["due"];
	        this.interest = source["interest"];
	    }
	}

}

