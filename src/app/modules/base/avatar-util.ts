export  class AvatarUtil{

    static getInitialCharacters = (nameParam:any = null) => {
   
        if(nameParam != null){
            let arrName:any[] = nameParam.split(" ");
            if(arrName.length > 0){
                let returnName = ""
                arrName
                .forEach( 
                    (name, index) => {
                        returnName += name.substring(0,1);
                        if((arrName.length - 1) > index  )
                            returnName += " "
                    }
                )
                return returnName;
            }else{
                return nameParam.substring(0,1)
            } 
        }
        return "user"
    }

}