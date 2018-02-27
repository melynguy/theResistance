
export class NationWideMovement {
    private name: string;
    private movementProtests: string[];

    constructor(name: string) {
        this.name = name;
        this.movementProtests = [];
    }

    getName() {
        return this.name;
    }

    addProtest(protestName: string) {
        if(this.containsProtest(protestName)) {
            return ("ERROR: This protest has already been added");
        } else {
            this.movementProtests.push(protestName);
        }
    }
    private containsProtest(protestName: string) {
        for(let i = 0; i < this.movementProtests.length; i++) {
            if(this.movementProtests[i] == protestName) {
                return true;
            }
        }
        return false;
    }
}

export class Protests {
    private name: string;
    private zipcode: string;
    private date: string;
    private protesters: Protester[];
    

    constructor(name: string, zipcode: string, date: string) {
        this.name = name;
        this.zipcode = zipcode;
        this.date = date;
        this.protesters = new Array();
    }

    addMember(member: Protester) {
        if(this.containsMember(member)) {
            return ("ERROR: This protestor has already been added");
        } else {
            this.protesters.push(member);
        }
        
    }

    getName() {
        return this.name;
    }
    getZipCode() {
        return this.zipcode;
    }

    getProtestors() {
        return this.protesters;
    }

    setTitle(newTitle: string) {
        this.name = newTitle;
    }

    setDate(newDate: string) {
        this.date = newDate;
    }

    private containsMember(member: Protester) {
        for(let i = 0; i < this.protesters.length; i++) {
            if(this.protesters[i].getName() == member.getName() && 
            this.protesters[i].getZipCode() == member.getZipCode()) {
                return true;
            }
        }
        return false;
    }
}

export class Protester {
    private email: string;
    private zipcode: string;
    private name: string;

    constructor(name: string, protesterEmail: string, zipcode: string) {
        this.email = protesterEmail;
        this.zipcode = zipcode;
        this.name = name;
    }

    getName() {
        return this.name;
    }
    getZipCode() {
        return this.zipcode;
    }

    getEmail() {
        return this.email;
    }

}

export class ResistanceManager {
    private members: Protester[];
    private protests: Protests[];
    private movements: NationWideMovement[];

    constructor() {
        this.members = new Array();
        this.protests = new Array();
        this.movements = new Array();
    }

    addMovement(name: string) {
        this.movements.push(new NationWideMovement(name));
        return name;
    }

    addMember(name: string, email: string, zipcode: string) {
        this.members.push(new Protester(name, email, zipcode));
        return name;        
    }

    addProtest(newProtestName:string, zipcode: string, date: string) {
        this.protests.push(new Protests(newProtestName, zipcode, date));
        return newProtestName;
    }

    addProtestToMovement(protestName: string, movementName: string) {
        for(var i = 0; i < this.movements.length; i++) {
            if(this.movements[i].getName().toLowerCase() == movementName.toLowerCase()) {
                this.movements[i].addProtest(protestName);
            }
        }
    }

    private containsProtest(protestName: string) {
        for(let i = 0; i < this.protests.length; i++) {
            if(this.protests[i].getName() == protestName) {
                return true;
            }
        }
        return false;
    }

    addMemberToProtest(memberName: string, protestName: string) {
        for(var i = 0; i < this.members.length; i++) {
            if(this.members[i].getName().toLowerCase() == memberName.toLowerCase()) {
                for(var j = 0; j < this.protests.length; j++) {
                    if(this.protests[j].getName().toLowerCase() == protestName.toLowerCase()) {
                        this.protests[j].addMember(this.members[i]);
                        break;
                    }
                }
            }
        }
    }

    modifyProtest(protestName: string, newTitle? : string, newTime? : string) {
        for(var i = 0; i < this.protests.length; i++) {
            if(this.protests[i].getName().toLowerCase() == protestName.toLowerCase()) {
                if(newTitle == undefined) {
                    this.protests[i].setDate(newTime);
                } else {
                    this.protests[i].setTitle(newTitle);
                }
            }
        }
    }

    getProtesters(protestName: string) {
        var protesterNames = [];
        var protesters = [];
        for(var i = 0; i < this.protests.length; i++) {
            if(this.protests[i].getName().toLowerCase() == protestName.toLowerCase()) {
                protesters = this.protests[i].getProtestors();
            }
        }

        for(var i = 0; i < protesters.length; i++) {
            protesterNames.push(protesters[i].getName());
        }

        return protesterNames;
    }

    getUsersNearProtest(protestName: string, distance2: number) {
        let protest = this.protests.find((p)=>{
			return p.getName() === protestName;
		});
		if( !protest )
			return ["ERROR: invalid protest"];
		if( !protest.getZipCode().match(/\d{5}/) )
			return ["ERROR: bad zipcode"];

		let dist = mileMeter(distance2);
		let res = this.members.filter((m)=>{
			var diff = calcDistance(protest.getZipCode(), m.getZipCode());
			return ( diff < dist );
		}).map((p)=>{
			return p.getName();
		});

		if(res.length<1)
			return ['none found'];
		return res;
    }

    getNearbyProtests(zip: string, distance: number) {
        if( !zip.match(/\d{5}/) )
			return ["ERROR: bad zipcode"];
		let dist = mileMeter(distance);
		let res = this.protests.filter((m)=>{
			var diff = calcDistance(zip, m.getZipCode());
			return ( diff < dist );
		}).map((p)=>{
			return p.getName();
		});

		if(res.length<1)
			return ['none found'];
		return res;
    }

    private searchArray(query:string, array:any[]) {
        var matchingProtestNames = [];
        for(var i = 0; i < array.length; i++) {
            var name = array[i].getName();
            if(name.indexOf(query) != -1) {
                matchingProtestNames.push(name);
            }
        }
        return matchingProtestNames;

    }

    findProtestNames(query: string) {
        return this.searchArray(query, this.protests);
    }

    findMemberNames(query: string) {
        return this.searchArray(query, this.members);
    }

    findMovementNames(query: string) {
        return this.searchArray(query, this.movements);
    }
}

const zips = require('./index').zips;
const geolib = require('geolib');
function calcDistance(zip1, zip2){
	return geolib.getDistance(zips[zip1], zips[zip2]);
}
function mileMeter(mi){
	return mi*1609.34;
}