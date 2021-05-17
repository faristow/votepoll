import { Component, OnInit } from '@angular/core';
import { VoteService } from '../vote.service';
import { Vote } from '../vote.model';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit, OnDestroy {
  votes : Vote[] = [];
  //setting up the listener to the subject and storin gin the subscription.
  private votesSub: Subscription;
  constructor( private vote_service : VoteService) { }

  ngOnInit(): void {
     this.vote_service.getVotes();
     this.votesSub = this.vote_service.getVoteUpdateListener()
    .subscribe((votes : Vote[]) =>{
      this.votes = votes;
    });
  }


  onDelete(voteId : string){
    this.vote_service.deleteVote(voteId)
  }

  //Unsubscribing the created subscription to avoid memory leakage
  ngOnDestroy() {
    this.votesSub.unsubscribe();
  }

}
