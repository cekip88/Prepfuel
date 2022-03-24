import { G_Bus } from "./libs/G_Control.js";
import { _front } from "./libs/_front.js";
import GSelect from "./components/select/select.component.js"
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    G_Bus.on('testSubmit',_.testSubmit.bind(_))
    G_Bus.on('testChange',_.testChange.bind(_))
    G_Bus.on('anotherChange',_.anotherChange.bind(_))
  }
  async testSubmit(submitData){
    const _ = this;
    submitData.event.preventDefault()
    console.log(
      submitData['item'].elements)

    let formData = await _.formDataCapture(submitData['item']);
    console.log(formData)
  }

  testChange(data){
    console.log(data)
  }
  anotherChange(data){
    console.log(data)
  }
	
}
new Front();
