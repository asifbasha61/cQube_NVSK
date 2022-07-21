import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { IReportDataPayload } from 'src/app/core/models/IReportDataPayload';
import { CommonService } from 'src/app/core/services/common/common.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-curriculum-framework',
  templateUrl: './curriculum-framework.component.html',
  styleUrls: ['./curriculum-framework.component.scss']
})
export class CurriculumFrameworkComponent implements OnInit {

  config: string = environment.config;
  state: any= 'IN';
  filters: any;
  NVSK: boolean = true;
  isMapReportLoading = true;
  NCFMetrics: any[] | undefined;
  ncfProgressData: any;

  constructor(private readonly _commonService: CommonService, private readonly _spinner:NgxSpinnerService, private readonly _configService: ConfigService) {
    this._configService.getVanityMetrics('ncf').subscribe(vanityMetricsRes => {
      this.NCFMetrics = vanityMetricsRes.result;
    });
    this.getNcfProgressData(this.filters);
  }

  ngOnInit(): void {
  }
  getNcfProgressData(filters: any): void {
    let data: IReportDataPayload = {
      appName: environment.config.toLowerCase(),
      dataSourceName: 'ncf',
      reportName: 'progressOfNCF',
      reportType: 'map',
      stateCode: environment.stateCode,
      filters
    };

    this._commonService.getReportData(data).subscribe(res => {
      this._spinner.hide()
      this.isMapReportLoading = false;
      this.ncfProgressData = res.result;
      this.filters = res.result.filters;
      if(res.result.code){
        this.state = res.result.code;
      }
    }, err => {
      this.isMapReportLoading = false;
    });
  }

  onTabChanged($event: any): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  filtersUpdated(filters: any): void {
    this.getNcfProgressData(filters);
  }
}