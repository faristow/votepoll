import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Vote } from '../vote.model';
import { VoteService } from '../vote.service';
import { mimeType } from "./mime-type.validator"

@Component({
  selector: 'app-vote-create',
  templateUrl: './vote-create.component.html',
  styleUrls: ['./vote-create.component.css']
})
export class VoteCreateComponent implements OnInit {
  private mode ="create"
  private voteId : string;
  imagePreview: string;
  vote : Vote
  isLoading = false
  partyForm : FormGroup

  constructor( private vote_service : VoteService, public router: Router, public route : ActivatedRoute,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
   this.initForm()
    //paramMap is observable that can be subscribed
    this.route.paramMap.subscribe((paramMap : ParamMap) =>{
      //voteId is the one which we appeneded in the routing.modeule.ts
      if(paramMap.has('voteId')){
        this.mode="edit"
        this.voteId = paramMap.get('voteId');
        console.log(this.voteId)
         this.vote_service.getVoteById(this.voteId).subscribe(({_id,title,content, imagePath,voteCount}) =>{

           this.partyForm.patchValue({
             title: title,
             content: content,
             image: imagePath,
             voteCount: voteCount
           })
         })
      }else{
        this.mode="create";
        this.voteId = null;
      }
    })
  }

  private initForm(){
    this.partyForm = this.formBuilder.group({
      'title': ['',[Validators.required,Validators.minLength(4)]],
      'content':['',[Validators.required,Validators.minLength(6)]],
      'voteCount': ['',[Validators.required]],
      'image': ['',[Validators.required]],
    })
  }
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.partyForm.patchValue({image: file});
    this.partyForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onAddParty(){
    if(this.partyForm.invalid){
      return;
    }
    if(this.mode === 'create'){
      this.vote_service.addVote(this.partyForm.value.title, this.partyForm.value.content, this.partyForm.value.image , this.partyForm.value.voteCount)
    }else{
      this.vote_service.updateVote(
        this.voteId,
        this.partyForm.value.title,
        this.partyForm.value.content,
        this.partyForm.value.image,
        this.partyForm.value.voteCount)
    }
     this.partyForm.reset();
     this.router.navigate(['/vote'])
  }

}
