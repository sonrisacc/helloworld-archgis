/*
  Copyright 2020 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import Map from 'esri/Map';

import SceneView from 'esri/views/SceneView';

import WebScene from 'esri/WebScene';
import BuildingSceneLayer from 'esri/layers/BuildingSceneLayer';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.scss'],
})
export class EsriMapComponent implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  private _zoom = 13;
  private _center: Array<number> = [-118.805, 34.027]; // longitude, latitude
  private _basemap = 'topo-vector';
  private _loaded = false;
  private _view: SceneView = null;
  private _ground = 'world-elevation';

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor() {}

  async initializeMap() {
    // Configure the Map
    console.log('this map', this._basemap);
    const mapProperties = {
      basemap: this._basemap,
      ground: this._ground,
    };

    const map = new Map(mapProperties);


    const webscene = new WebScene({
      portalItem: {
        id: "c7470b0e4e4c44288cf287d658155300"
      }
    });


    // Init scene view
    const sceneViewProperties = {
      container: this.mapViewEl.nativeElement,
      map: webscene,
    };

    // Create the BuildingSceneLayer and add it to the webscene
    const buildingLayer = new BuildingSceneLayer({
      url:
        "https://tiles.arcgis.com/tiles/V6ZHFr6zdgNZuVG0/arcgis/rest/services/BSL__4326__US_Redlands__EsriAdminBldg_PublicDemo/SceneServer",
      title: "Administration Building, Redlands - Building Scene Layer"
    });
    webscene.layers.add(buildingLayer);



    this._view = new SceneView(sceneViewProperties);

    // wait for the map to load
    await this._view.when();
    return this._view;
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    this.initializeMap().then((mapView) => {
      // The map has been initialized
      console.log('mapView ready: ', mapView.ready);
      this._loaded = mapView.ready;
      this.mapLoadedEvent.emit(true);

    });
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }
}
