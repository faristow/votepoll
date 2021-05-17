import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vote } from 'src/app/vote/vote.model';
import { VoteService } from 'src/app/vote/vote.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-votepoll',
  templateUrl: './votepoll.component.html',
  styleUrls: ['./votepoll.component.css']
})
export class VotepollComponent implements OnInit {

  votes : Vote[] = [];
  private votesSub: Subscription;
  voteId: string;
  vote : Vote
  count : number = 0;
  clicked: boolean = false
  IsUserCanVote: boolean = false
  constructor(public vote_service : VoteService, public userService : AuthService, public router: Router, public route : ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.getUserDetails()
    .subscribe(data =>{
      this.IsUserCanVote = data.isVoted
      // this.vote.id = data._id,
      // this.vote.content = data.content,
      // this.vote.title = data.title
    })
    this.vote_service.getVotes();
    this.votesSub = this.vote_service.getVoteUpdateListener()
    .subscribe((votes: Vote[]) =>{
      this.votes = votes
    })
  }

 //Unsubscribing the created subscription to avoid memory leakage
  ngOnDestroy() {
    this.votesSub.unsubscribe();
  }

  onVoting(partyName:string,id : string){
     this.vote_service.updateVoted(id).subscribe(data =>{
      console.log(data)
          })
    this.userService.updateUserVote()
    .subscribe(data =>{
    this.ngOnInit()
      alert("You have successfully voted" + partyName )
    })
    // this.count = this.count +1
    // console.log(this.count)

    // this.clicked = true;
  }

}
