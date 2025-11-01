import { Component, OnInit, Input } from '@angular/core';
import { DataService } from "../../data.service";
import { BaseComponent } from 'src/app/common/base.component';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent extends BaseComponent implements OnInit {

    constructor(
        protected data: DataService
    ) {
        super(data);
        this.model = this.data.model;
    }
}
