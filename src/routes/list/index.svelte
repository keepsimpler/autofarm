
<script>

    import { mapboxToken } from "$lib/conf.js";
	import { Map, Geocoder, Marker, controls } from "$lib/components.js";
  
	const { GeolocateControl, NavigationControl } = controls;
	const place = null;
  
	let page = "about";
	let center = { lat: 53.3358627, lng: -2.8572362 };
	let marker = center;
	let zoom = 11.15;
	let mapComponent;
  
	function placeChanged(e) {
	  const { result } = e.detail;
	  mapComponent.setCenter(result.center, 14);
	}
  
	function recentre({ detail }) {
	  center = detail.center;
	}
  
	function drag({ detail }) {
	  marker = detail.center;
	}

    // import Card from '$lib/Card.svelte';
    import LeafletMap from '$lib/LeafletMap.svelte';

    import { warehouses } from '../data.js';
</script>

<!-- <div class="container-fluid px-0 pt-3 d-flex flex-column align-items-center"> -->
    <div class="row no-gutters mt-1 mb-3 header">
        <div class="col">
            <h1>
                <a href="/">
                    <img class="logo-image" src="/images/logo.png" alt="Spacebay">
                </a>
            </h1>
        </div>
        <div class="col d-flex align-items-center">
            <!-- <div class="list-search"> -->
                <Geocoder
                accessToken={mapboxToken}
                on:result={placeChanged}
                on:clear={() => mapComponent.setCenter({ lng: 0, lat: 0 })}
              />

                <!-- <div  class="ml-3 border-0" placeholder="多伦多市，安大略省，加拿大"> </div> -->
                <!-- <div class="icon-bg rounded-circle ml-auto pointer mr-0"><img src="/images/search.svg" alt=""></div> -->
            <!-- </div> -->
    
        </div>
    
    </div>

    <div id="select" class="select-wrap">
        <div class="row no-gutters">
            <div class="col d-flex align-items-center">
                <div class="text">6836条记录</div>
                <div class="select-box pointer">
                    <div>仓库面积不限</div>
                    <div class="ml-auto"><img src="/images/down.svg" alt=""></div>
                </div>
                <div class="select-box pointer">
                    <div>仓库价格不限</div>
                    <div class="ml-auto"><img src="/images/down.svg" alt=""></div>
                </div>
                <div class="select-box pointer" style="width: 7.25rem">
                    <div>更多</div>
                    <div class="ml-auto"><img src="/images/down.svg" alt=""></div>
                </div>

                <div class="select-box active position-relative d-none"><!-- 选择后selectbox样式-->
                    <div>仓库面积不限</div>
                    <div class="ml-auto"><img src="/images/up.svg" alt=""></div>
                    <div class="select-show position-absolute">
                        <div class="select-content">仓库面积不限</div>
                        <div class="select-content">0-5000㎡</div>
                        <div class="select-content">5001-10,000㎡</div>
                        <div class="select-content">20,000㎡以上</div>
                    </div>
                </div>
                <div class="select-box active position-relative d-none" style="width: 7.25rem"><!-- 选择后selectbox样式-->
                    <div>更多</div>
                    <div class="ml-auto"><img src="/images/up.svg" alt=""></div>
                    <div class="select-show position-absolute pb-0">
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-2">
                            <input type="checkbox" class="custom-control-input" id="customCheck1">
                            <label class="custom-control-label" for="customCheck1">特征1</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck2">
                            <label class="custom-control-label" for="customCheck2">特征2</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-3 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck3">
                            <label class="custom-control-label" for="customCheck3">特征3</label>
                        </div>
                        <div class="custom-control custom-checkbox ml-3 mb-4 mt-1">
                            <input type="checkbox" class="custom-control-input" id="customCheck4">
                            <label class="custom-control-label" for="customCheck4">特征4</label>
                        </div>
                        <div class="mt-auto confirm pointer">确认</div>
                    </div>
                </div>

            </div>

        </div>

    </div>
    <div id="list" class="row no-gutters w-100">
        <div class="col-5 pb-4">
            <div class="row no-gutters p-4 mt-3 w-100">
                {#each warehouses as warehouse}
                <div class="col-6 no-gutters d-flex justify-content-center">
                    <div class="card border-0" style="width: 92%">
                        <a href="/list/detail">
                        <img src={warehouse.picture} class="card-img-top" alt={warehouse.name}>
                        </a>
                        <div class="card-body">
                            <p class="card-text">{warehouse.name}</p>
                            <p class="price-text">CAD {warehouse.price}/㎡·天</p>
                            <p class="location-text d-flex flex-row"><span class="d-flex align-items-center mr-1">
                                <img src="/images/location.svg" alt="">{warehouse.address}</span><span
                                    class="d-flex align-items-center ml-3"><img src="/images/square.svg" alt="">{warehouse.area}㎡</span>
                            </p>
                        </div>
                    </div>
                </div>
                {:else}
                    <p>loading</p>
                {/each}
        
            </div>
            <div class="mt-auto d-flex flex-row justify-content-center w-100">
                <div class="d-flex flex-row align-items-center mb-3">
                    <div class="page-no-bg">
                        <img src="/images/left.svg" alt="">
                    </div>
                    <div class="page-no ml-3 page-no-active">1</div>
                    <div class="page-no ml-3">2</div>
                    <div class="page-no ml-3">3</div>
                    <div class="page-no ml-3">4</div>
                    <div class="page-no ml-3">5</div>
                    <div class="ml-3">...</div>
                    <div class="page-no ml-3">10</div>
                    <div class="page-no-bg ml-3">
                        <img src="/images/right.svg" alt="">
                    </div>
                    <div class="ml-3">跳至</div>
                    <div class="page-no-box ml-3"><input type="number" class="border-0 text-center"></div>
                    <div class="ml-3">页</div>
                </div>
            </div>
        </div>
        <div class="col-7">
            <div class="map-wrap">
				<Map
				  bind:this={mapComponent}
				  accessToken={mapboxToken}
				  on:recentre={recentre}
				  on:drag={drag}
				  {center}
				  bind:zoom
				>
				  <NavigationControl />
				  <GeolocateControl
					on:geolocate={(e) => console.log("geolocated", e.detail)}
				  />
				  <Marker lat={center.lat} lng={center.lng} label="M-Kite加拿大海外仓" />
				  <Marker lat={center.lat+0.01} lng={center.lng+0.01} label="安美集团加拿大海外仓" />
				  <Marker lat={center.lat+0.01} lng={center.lng-0.01} label="中南通达加拿大仓" />
				  <Marker lat={center.lat-0.01} lng={center.lng+0.01} label="乐天速递加拿大海外仓" />
				  <Marker lat={center.lat-0.01} lng={center.lng-0.01} label="千亚国际加拿大海外仓" />
				</Map>
			  </div>
        </div>

    </div>
<!-- </div> -->


<style>

	.map-wrap {
	  width: 100%;
	  height: 800px;
	}
  
  </style>
  