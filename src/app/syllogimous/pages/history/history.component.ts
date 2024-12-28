import { Component } from '@angular/core';
import { SyllogimousService } from '../../services/syllogimous.service';
import { Question } from '../../models/question.models';
import { Router } from '@angular/router';
import { EnumScreens } from '../../constants/syllogimous.constants';
import { ToastService } from 'src/app/services/toast.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent {
    EnumScreens = EnumScreens;
    questions: Question[] = [];
    
    constructor(
        public sylSrv: SyllogimousService,
        public router: Router,
        private toaster: ToastService
    ) { }

    ngOnInit() {
        this.questions = this.sylSrv.questionsFromLS;
    }

    copyQuestion(q: Question) {
        const el = document.createElement("TEXTAREA") as HTMLTextAreaElement;
        document.body.appendChild(el);
        el.value = JSON.stringify(q, null, 2);
        el.focus();
        el.select();
        document.execCommand("copy");
        this.toaster.show("Question copied into your clipboard!", { classname: "bg-success text-light" });
        document.body.removeChild(el);
    }
}
