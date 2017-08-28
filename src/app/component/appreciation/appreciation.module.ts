import { NgModule } from '@angular/core'; 
import { AppreciationComponent } from './appreciation.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { ByMeComponent } from './by-me/byme';
import { ForMeComponent } from './for-me/forme';
import { AddAppreciation } from './add/add';

@NgModule({
	imports : [ SharedModule, RouterModule.forChild([
		{path : '' , redirectTo:'for-me' , pathMatch:'full'},
			{
				path : '',
				component : AppreciationComponent,
				children : [
					{
						path : 'for-student',
						component : ByMeComponent
					},
					{
						path : 'for-me',
						component : ForMeComponent
					}
				]
			},
			{
				path : 'add-appreciation',
				component : AddAppreciation
			}
			
		])],
	declarations : [ AddAppreciation, ByMeComponent, AppreciationComponent, ForMeComponent ]
}) 
export class AppreciationModule {
	
}
