import { Component, OnInit } from '@angular/core';
import { IReportDataPayload } from 'src/app/core/models/IReportDataPayload';
import { CommonService } from 'src/app/core/services/common/common.service';
import { environment } from 'src/environments/environment';
import * as Highcharts from "highcharts/highstock";

@Component({
  selector: 'app-performance-comparision-by-grade-subject',
  templateUrl: './performance-comparision-by-grade-subject.component.html',
  styleUrls: ['./performance-comparision-by-grade-subject.component.scss']
})
export class PerformanceComparisionByGradeSubjectComponent implements OnInit {
  filters: any;
  levels: any;
  options: Highcharts.Options | undefined;
  
  constructor(private readonly _commonService: CommonService) {
    this.getScatterData(this.filters, this.levels);
  }

  ngOnInit(): void {
  }

  getScatterData(filters: any, levels: any): void {
    let data: IReportDataPayload = {
      appName: environment.config.toLowerCase(),
      dataSourceName: 'nas',
      reportName: 'studentPerformance',
      reportType: 'scatterPlot',
      stateCode: environment.stateCode,
      filters,
      levels
    };

    this._commonService.getReportData(data).subscribe(res => {
      this.filters = res.result.filters;
      this.levels = res.result.levels;

      this.options = {
        tooltip: {
          formatter: function() {
            return (this.point as any).data;
          }
        },
        series: [{
          name: 'Performance',
          type: 'scatter',
          color: 'rgba(223, 83, 83, .5)',
          data: res.result.data
        }]
      };
    });
  }

  scatterFiltersUpdated(filters: any): void {
    this.getScatterData(filters, this.levels);
  }

  onScatterSelectLevel(event: any): void {
    event.items.forEach((level: any, levelInd: number) => {
        level.selected = levelInd === event.index;
    });

    this.getScatterData(this.filters, event.items);
  }

}